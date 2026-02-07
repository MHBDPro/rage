"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, slots, settings, scrimSessions, type ScrimSession } from "@/lib/db";
import { eq, and, desc, asc, ne } from "drizzle-orm";
import { containsProfanity } from "@/lib/profanity";

const registerSchema = z.object({
  teamName: z
    .string()
    .min(2, "Takım adı en az 2 karakter olmalıdır")
    .max(100, "Takım adı 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Takım adı uygunsuz içerik barındırıyor",
    }),
  instagram: z
    .string()
    .min(1, "Instagram kullanıcı adı gereklidir")
    .max(100, "Instagram kullanıcı adı 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Instagram kullanıcı adı uygunsuz içerik barındırıyor",
    }),
  slotNumber: z.coerce
    .number()
    .int()
    .min(1, "Geçersiz slot numarası")
    .max(25, "Geçersiz slot numarası"),
  playerNames: z
    .array(
      z
        .string()
        .min(2, "Oyuncu adı en az 2 karakter olmalıdır")
        .max(50, "Oyuncu adı 50 karakterden az olmalıdır")
        .refine((val) => !containsProfanity(val), {
          message: "Oyuncu adı uygunsuz içerik barındırıyor",
        })
    )
    .length(4, "4 oyuncu adı girilmelidir"),
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
      return { success: false, message: "Seçilen maç bulunamadı." };
    }

    const currentSession = session[0];
    const currentSettings = await getSettings();

    if (currentSettings.isMaintenance) {
      return {
        success: false,
        message: "Kayıt şu anda bakım için devre dışı bırakıldı.",
      };
    }

    if (!isSessionOpen(currentSession)) {
      return {
        success: false,
        message: "Kayıt şu anda kapalı. Lütfen daha sonra tekrar deneyin.",
      };
    }

    const rawData = {
      teamName: formData.get("teamName"),
      instagram: formData.get("instagram"),
      slotNumber: formData.get("slotNumber"),
      playerNames: [
        formData.get("playerName1"),
        formData.get("playerName2"),
        formData.get("playerName3"),
        formData.get("playerName4"),
      ],
    };

    const parsed = registerSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0].message,
      };
    }

    const { teamName, instagram, slotNumber, playerNames } = parsed.data;
    const clientIP = await getClientIP();

    const existingRegistration = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.ipAddress, clientIP)))
      .limit(1);

    if (existingRegistration.length > 0) {
      return {
        success: false,
        message: "Bu maç için zaten bir takım kaydettiniz. IP başına oturum başına bir kayıt yapılabilir.",
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
          message: `Slot #${slotNumber} kilitli. Lütfen başka bir slot seçin.`,
        };
      }

      return {
        success: false,
        message: `Slot #${slotNumber} zaten dolu. Lütfen başka bir slot seçin.`,
      };
    }

    await db.insert(slots).values({
      sessionId,
      slotNumber,
      teamName,
      instagram: instagram.startsWith("@") ? instagram : `@${instagram}`,
      ipAddress: clientIP,
      playerNames,
      isLocked: false,
    });

    revalidatePath("/");
    revalidatePath(`/scrims/${currentSession.slug}`);

    return {
      success: true,
      message: `Slot #${slotNumber} için başarıyla kayıt oldunuz!`,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}
