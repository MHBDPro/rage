"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, slots, settings, scrimSessions, type ScrimSession } from "@/lib/db";
import { eq, and, desc, asc, ne, gt, count } from "drizzle-orm";
import { containsProfanity } from "@/lib/profanity";

const registerSchema = z.object({
  playerName: z
    .string()
    .min(2, "Oyuncu adı en az 2 karakter olmalıdır")
    .max(100, "Oyuncu adı 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Oyuncu adı uygunsuz içerik barındırıyor",
    }),
  psnId: z
    .string()
    .min(2, "PSN/Konami ID en az 2 karakter olmalıdır")
    .max(100, "PSN/Konami ID 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "PSN/Konami ID uygunsuz içerik barındırıyor",
    }),
  teamSelection: z
    .string()
    .min(2, "Takım seçimi en az 2 karakter olmalıdır")
    .max(100, "Takım seçimi 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Takım seçimi uygunsuz içerik barındırıyor",
    }),
  slotNumber: z.coerce
    .number()
    .int()
    .min(1, "Geçersiz kontenjan numarası"),
});

export type ActionResponse = {
  success: boolean;
  message: string;
};

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

async function getSettings() {
  const result = await db
    .select()
    .from(settings)
    .orderBy(desc(settings.updatedAt), desc(settings.id))
    .limit(1);

  if (result.length === 0) {
    const defaultSettings = await db
      .insert(settings)
      .values({
        isMaintenance: false,
        announcement: null,
      })
      .returning();
    return defaultSettings[0];
  }
  return result[0];
}

function isSessionOpen(session: ScrimSession): boolean {
  return session.status !== "completed" && new Date() >= session.startTime;
}

export async function getScrimSettings() {
  return getSettings();
}

export async function getScrimSessionBySlug(slug: string) {
  const result = await db
    .select()
    .from(scrimSessions)
    .where(eq(scrimSessions.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function getScrimSessionsForLanding(limit = 8) {
  return db
    .select()
    .from(scrimSessions)
    .where(ne(scrimSessions.status, "completed"))
    .orderBy(asc(scrimSessions.startTime))
    .limit(limit);
}

export async function getUpcomingScrimSessions(limit = 8) {
  return db
    .select()
    .from(scrimSessions)
    .where(and(ne(scrimSessions.status, "completed"), gt(scrimSessions.startTime, new Date())))
    .orderBy(asc(scrimSessions.startTime))
    .limit(limit);
}

export async function getFastCupSessions(limit = 6) {
  return db
    .select()
    .from(scrimSessions)
    .where(
      and(
        ne(scrimSessions.status, "completed"),
        eq(scrimSessions.isFastCup, true)
      )
    )
    .orderBy(asc(scrimSessions.startTime))
    .limit(limit);
}

export async function getScrimSessionsIndex() {
  return db
    .select()
    .from(scrimSessions)
    .where(ne(scrimSessions.status, "completed"))
    .orderBy(asc(scrimSessions.startTime));
}

export async function getLastChampionSession() {
  const result = await db
    .select()
    .from(scrimSessions)
    .where(eq(scrimSessions.status, "completed"))
    .orderBy(desc(scrimSessions.startTime))
    .limit(1);

  return result[0] || null;
}

export async function getSlotsForSession(sessionId: number) {
  return db
    .select()
    .from(slots)
    .where(eq(slots.sessionId, sessionId))
    .orderBy(slots.slotNumber);
}

export async function registerSlot(
  sessionId: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await db
      .select()
      .from(scrimSessions)
      .where(eq(scrimSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return { success: false, message: "Seçilen turnuva bulunamadı." };
    }

    const currentSession = session[0];
    const currentSettings = await getSettings();

    if (currentSettings.isMaintenance) {
      return {
        success: false,
        message: "Kayıt şu anda bakım nedeniyle devre dışı.",
      };
    }

    if (!isSessionOpen(currentSession)) {
      return {
        success: false,
        message: "Kayıt henüz açılmadı. Lütfen başlangıç saatinde tekrar deneyin.",
      };
    }

    const rawData = {
      playerName: formData.get("playerName"),
      psnId: formData.get("psnId"),
      teamSelection: formData.get("teamSelection"),
      slotNumber: formData.get("slotNumber"),
    };

    const parsed = registerSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0].message,
      };
    }

    const { playerName, psnId, teamSelection, slotNumber } = parsed.data;

    if (slotNumber > currentSession.maxSlots) {
      return {
        success: false,
        message: `Bu turnuva için geçerli kontenjan aralığı 1-${currentSession.maxSlots}.`,
      };
    }

    const filledCountResult = await db
      .select({ value: count() })
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.isLocked, false)));

    const filledCount = Number(filledCountResult[0]?.value || 0);
    if (filledCount >= currentSession.maxSlots) {
      return {
        success: false,
        message: "Turnuva kontenjanı doldu. Kayıtlar otomatik olarak kapatıldı.",
      };
    }

    const clientIP = await getClientIP();

    const existingIpRegistration = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.ipAddress, clientIP)))
      .limit(1);

    if (existingIpRegistration.length > 0) {
      return {
        success: false,
        message: "Bu turnuva için bu IP adresinden zaten kayıt yapılmış.",
      };
    }

    const existingPsnRegistration = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.psnId, psnId)))
      .limit(1);

    if (existingPsnRegistration.length > 0) {
      return {
        success: false,
        message: "Bu PSN/Konami ID ile zaten kayıt mevcut.",
      };
    }

    const existingSlot = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.slotNumber, slotNumber)))
      .limit(1);

    if (existingSlot.length > 0) {
      if (existingSlot[0].isLocked) {
        return {
          success: false,
          message: `Kontenjan #${slotNumber} kilitli. Lütfen başka bir kontenjan seçin.`,
        };
      }

      return {
        success: false,
        message: `Kontenjan #${slotNumber} dolu. Lütfen başka bir kontenjan seçin.`,
      };
    }

    await db.insert(slots).values({
      sessionId,
      slotNumber,
      playerName,
      psnId,
      teamSelection,
      teamName: playerName,
      instagram: null,
      ipAddress: clientIP,
      playerNames: [playerName],
      isLocked: false,
    });

    revalidatePath("/");
    revalidatePath("/fast-cup");
    revalidatePath("/scrims");
    revalidatePath(`/scrims/${currentSession.slug}`);

    return {
      success: true,
      message: `Kontenjan #${slotNumber} için kaydınız başarıyla alındı!`,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}
