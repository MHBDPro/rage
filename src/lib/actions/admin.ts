"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  db,
  slots,
  settings,
  leaderboards,
  leaderboardEntries,
  scrimSessions,
  dailyScrimTemplates,
  DEFAULT_RULES_CONFIG,
  type RulesConfig,
  type RuleCard,
  type PointSystemItem,
  type ScrimStatus,
  type TournamentType,
  type LeaderboardStatus,
} from "@/lib/db";
import { eq, and, desc, asc, ne, lt } from "drizzle-orm";
import { getSession } from "@/lib/auth/jwt";
import { containsProfanity } from "@/lib/profanity";
import { parseIstanbulDateTime, slugify, getIstanbulDateKey } from "@/lib/utils";

export type ActionResponse = {
  success: boolean;
  message: string;
};

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

async function generateUniqueSlug(base: string, excludeId?: number) {
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: scrimSessions.id })
      .from(scrimSessions)
      .where(
        excludeId
          ? and(eq(scrimSessions.slug, slug), ne(scrimSessions.id, excludeId))
          : eq(scrimSessions.slug, slug)
      )
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    counter += 1;
    slug = `${base}-${counter}`;
  }
}

// Scrim Sessions
const sessionSchema = z.object({
  title: z
    .string()
    .min(2, "Başlık en az 2 karakter olmalıdır")
    .max(200, "Başlık 200 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Başlık uygunsuz içerik barındırıyor",
    }),
  slug: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : "")),
  startTime: z.string().min(1, "Başlangıç zamanı gereklidir"),
  mode: z.enum(["BO1", "BO3"]),
  mapName: z
    .string()
    .min(2, "Lig etiketi en az 2 karakter olmalıdır")
    .max(100, "Lig etiketi 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Lig etiketi uygunsuz içerik barındırıyor",
    }),
  maxSlots: z.coerce.number().int().min(2, "Kontenjan en az 2 olmalıdır").max(128, "Kontenjan en fazla 128 olabilir").refine((val) => val < 20 || val > 28, {
    message: "Bu site PUBG scrim açmak için kullanılamaz.",
  }),
  tournamentType: z.enum(["ucl", "uel", "ukl", "fast_cup", "custom"]),
  isFastCup: z.coerce.boolean(),
  status: z.enum(["active", "closed", "completed"]),
  announcement: z
    .string()
    .max(500, "Duyuru en fazla 500 karakter olabilir")
    .optional()
    .nullable()
    .refine((val) => !val || !containsProfanity(val), {
      message: "Duyuru uygunsuz içerik barındırıyor",
    }),
});

const dailyTemplateSchema = z.object({
  name: z
    .string()
    .min(2, "Şablon adı en az 2 karakter olmalıdır")
    .max(100, "Şablon adı 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Şablon adı uygunsuz içerik barındırıyor",
    }),
  title: z
    .string()
    .min(2, "Başlık en az 2 karakter olmalıdır")
    .max(200, "Başlık 200 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Başlık uygunsuz içerik barındırıyor",
    }),
  slugSuffix: z
    .string()
    .min(2, "Slug suffix en az 2 karakter olmalıdır")
    .max(50, "Slug suffix 50 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Slug suffix uygunsuz içerik barındırıyor",
    }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Geçersiz saat formatı"),
  mode: z.enum(["BO1", "BO3"]),
  mapName: z
    .string()
    .min(2, "Lig etiketi en az 2 karakter olmalıdır")
    .max(100, "Lig etiketi 100 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Lig etiketi uygunsuz içerik barındırıyor",
    }),
  maxSlots: z.coerce.number().int().min(2, "Kontenjan en az 2 olmalıdır").max(128, "Kontenjan en fazla 128 olabilir").refine((val) => val < 20 || val > 28, {
    message: "Bu site PUBG scrim açmak için kullanılamaz.",
  }),
  tournamentType: z.enum(["ucl", "uel", "ukl", "fast_cup", "custom"]),
  isFastCup: z.coerce.boolean(),
  announcement: z
    .string()
    .max(500, "Duyuru en fazla 500 karakter olabilir")
    .optional()
    .nullable()
    .refine((val) => !val || !containsProfanity(val), {
      message: "Duyuru uygunsuz içerik barındırıyor",
    }),
  isEnabled: z.coerce.boolean(),
});

export async function getScrimSessionsAdmin() {
  if (!(await requireAdmin())) {
    return [];
  }

  return db.select().from(scrimSessions).orderBy(desc(scrimSessions.startTime));
}

export async function getScrimSessionAdmin(id: number) {
  if (!(await requireAdmin())) {
    return null;
  }

  const result = await db
    .select()
    .from(scrimSessions)
    .where(eq(scrimSessions.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getDailyScrimTemplates() {
  if (!(await requireAdmin())) {
    return [];
  }

  return db.select().from(dailyScrimTemplates).orderBy(asc(dailyScrimTemplates.startTime));
}

export async function createDailyScrimTemplate(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      name: formData.get("name"),
      title: formData.get("title"),
      slugSuffix: formData.get("slugSuffix"),
      startTime: formData.get("startTime"),
      mode: formData.get("mode"),
      mapName: formData.get("mapName"),
      maxSlots: formData.get("maxSlots"),
      tournamentType: formData.get("tournamentType"),
      isFastCup: formData.get("isFastCup") === "true",
      announcement: formData.get("announcement") || null,
      isEnabled: formData.get("isEnabled") === "true",
    };

    const parsed = dailyTemplateSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    await db.insert(dailyScrimTemplates).values({
      name: parsed.data.name,
      title: parsed.data.title,
      slugSuffix: parsed.data.slugSuffix,
      startTime: parsed.data.startTime,
      mode: parsed.data.mode,
      mapName: parsed.data.mapName,
      maxSlots: parsed.data.maxSlots,
      tournamentType: parsed.data.tournamentType as TournamentType,
      isFastCup: parsed.data.isFastCup,
      announcement: parsed.data.announcement || null,
      isEnabled: parsed.data.isEnabled,
    });

    revalidatePath("/admin/scrims/templates");
    return { success: true, message: "Günlük turnuva şablonu oluşturuldu" };
  } catch (error) {
    console.error("Daily template error:", error);
    return { success: false, message: "Şablon oluşturulamadı" };
  }
}

export async function updateDailyScrimTemplate(
  id: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      name: formData.get("name"),
      title: formData.get("title"),
      slugSuffix: formData.get("slugSuffix"),
      startTime: formData.get("startTime"),
      mode: formData.get("mode"),
      mapName: formData.get("mapName"),
      maxSlots: formData.get("maxSlots"),
      tournamentType: formData.get("tournamentType"),
      isFastCup: formData.get("isFastCup") === "true",
      announcement: formData.get("announcement") || null,
      isEnabled: formData.get("isEnabled") === "true",
    };

    const parsed = dailyTemplateSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    await db
      .update(dailyScrimTemplates)
      .set({
        name: parsed.data.name,
        title: parsed.data.title,
        slugSuffix: parsed.data.slugSuffix,
        startTime: parsed.data.startTime,
        mode: parsed.data.mode,
        mapName: parsed.data.mapName,
        maxSlots: parsed.data.maxSlots,
        tournamentType: parsed.data.tournamentType as TournamentType,
        isFastCup: parsed.data.isFastCup,
        announcement: parsed.data.announcement || null,
        isEnabled: parsed.data.isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(dailyScrimTemplates.id, id));

    revalidatePath("/admin/scrims/templates");
    return { success: true, message: "Günlük turnuva şablonu güncellendi" };
  } catch (error) {
    console.error("Daily template update error:", error);
    return { success: false, message: "Şablon güncellenemedi" };
  }
}

export async function deleteDailyScrimTemplate(id: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    await db.delete(dailyScrimTemplates).where(eq(dailyScrimTemplates.id, id));
    revalidatePath("/admin/scrims/templates");
    return { success: true, message: "Şablon silindi" };
  } catch (error) {
    console.error("Daily template delete error:", error);
    return { success: false, message: "Şablon silinemedi" };
  }
}

export async function runDailyScrimRollover(): Promise<ActionResponse> {
  try {
    const templates = await db
      .select()
      .from(dailyScrimTemplates)
      .where(eq(dailyScrimTemplates.isEnabled, true))
      .orderBy(asc(dailyScrimTemplates.startTime));

    if (templates.length === 0) {
      return { success: false, message: "Şablon bulunamadı veya devre dışı" };
    }

    const todayKey = getIstanbulDateKey();
    for (const template of templates) {
      const slugBase = slugify(`daily-${todayKey}-${template.slugSuffix}`);

      const existing = await db
        .select()
        .from(scrimSessions)
        .where(eq(scrimSessions.slug, slugBase))
        .limit(1);

      if (existing.length === 0) {
        const startTime = parseIstanbulDateTime(
          `${todayKey.slice(0, 4)}-${todayKey.slice(4, 6)}-${todayKey.slice(6, 8)}T${template.startTime}`
        );

        await db.insert(scrimSessions).values({
          title: template.title,
          slug: slugBase,
          startTime,
          mode: template.mode,
          mapName: template.mapName,
          maxSlots: template.maxSlots,
          tournamentType: template.tournamentType,
          isFastCup: template.isFastCup,
          status: "closed",
          announcement: template.announcement || null,
          updatedAt: new Date(),
        });
      }
    }

    const todayStart = parseIstanbulDateTime(
      `${todayKey.slice(0, 4)}-${todayKey.slice(4, 6)}-${todayKey.slice(6, 8)}T00:00`
    );

    await db
      .update(scrimSessions)
      .set({ status: "completed", updatedAt: new Date() })
      .where(
        and(
          ne(scrimSessions.status, "completed"),
          lt(scrimSessions.startTime, todayStart)
        )
      );

    revalidatePath("/");
    revalidatePath("/fast-cup");
    revalidatePath("/admin/scrims");
    revalidatePath("/admin/scrims/templates");

    return { success: true, message: "Günlük turnuva oluşturma tamamlandı" };
  } catch (error) {
    console.error("Daily rollover error:", error);
    return { success: false, message: "Günlük turnuva oluşturulamadı" };
  }
}

export async function createScrimSession(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      startTime: formData.get("startTime"),
      mode: formData.get("mode"),
      mapName: formData.get("mapName"),
      maxSlots: formData.get("maxSlots"),
      tournamentType: formData.get("tournamentType"),
      isFastCup: formData.get("isFastCup") === "true",
      status: formData.get("status"),
      announcement: formData.get("announcement") || null,
    };

    const parsed = sessionSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const baseSlug = slugify(parsed.data.slug || parsed.data.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug);
    const startTime = parseIstanbulDateTime(parsed.data.startTime);

    await db.insert(scrimSessions).values({
      title: parsed.data.title,
      slug: uniqueSlug,
      startTime,
      mode: parsed.data.mode,
      mapName: parsed.data.mapName,
      maxSlots: parsed.data.maxSlots,
      tournamentType: parsed.data.tournamentType as TournamentType,
      isFastCup: parsed.data.isFastCup,
      status: parsed.data.status as ScrimStatus,
      announcement: parsed.data.announcement || null,
      updatedAt: new Date(),
    });

    revalidatePath("/admin/scrims");
    revalidatePath("/");

    return { success: true, message: "Turnuva oturumu oluşturuldu" };
  } catch (error) {
    console.error("Create scrim session error:", error);
    return { success: false, message: "Turnuva oturumu oluşturulamadı" };
  }
}

export async function updateScrimSession(
  sessionId: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      startTime: formData.get("startTime"),
      mode: formData.get("mode"),
      mapName: formData.get("mapName"),
      maxSlots: formData.get("maxSlots"),
      tournamentType: formData.get("tournamentType"),
      isFastCup: formData.get("isFastCup") === "true",
      status: formData.get("status"),
      announcement: formData.get("announcement") || null,
    };

    const parsed = sessionSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const baseSlug = slugify(parsed.data.slug || parsed.data.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug, sessionId);
    const startTime = parseIstanbulDateTime(parsed.data.startTime);

    await db
      .update(scrimSessions)
      .set({
        title: parsed.data.title,
        slug: uniqueSlug,
        startTime,
        mode: parsed.data.mode,
        mapName: parsed.data.mapName,
        maxSlots: parsed.data.maxSlots,
        tournamentType: parsed.data.tournamentType as TournamentType,
        isFastCup: parsed.data.isFastCup,
        status: parsed.data.status as ScrimStatus,
        announcement: parsed.data.announcement || null,
        updatedAt: new Date(),
      })
      .where(eq(scrimSessions.id, sessionId));

    revalidatePath("/admin/scrims");
    revalidatePath(`/admin/scrims/${sessionId}`);
    revalidatePath("/");

    return { success: true, message: "Turnuva oturumu güncellendi" };
  } catch (error) {
    console.error("Update scrim session error:", error);
    return { success: false, message: "Turnuva oturumu güncellenemedi" };
  }
}

export async function deleteScrimSession(sessionId: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    await db.delete(scrimSessions).where(eq(scrimSessions.id, sessionId));

    revalidatePath("/admin/scrims");
    revalidatePath("/");

    return { success: true, message: "Turnuva oturumu silindi" };
  } catch (error) {
    console.error("Delete scrim session error:", error);
    return { success: false, message: "Turnuva oturumu silinemedi" };
  }
}

export async function setChampion(
  sessionId: number,
  championTeam: string
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  if (!championTeam || containsProfanity(championTeam)) {
    return { success: false, message: "Geçersiz takım adı" };
  }

  try {
    await db
      .update(scrimSessions)
      .set({
        championTeam,
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(scrimSessions.id, sessionId));

    revalidatePath("/");
    revalidatePath(`/admin/scrims/${sessionId}`);

    return { success: true, message: "Şampiyon güncellendi" };
  } catch (error) {
    console.error("Set champion error:", error);
    return { success: false, message: "Şampiyon güncellenemedi" };
  }
}

// Slot Management (Session Scoped)
const addSlotSchema = z.object({
  slotNumber: z.coerce.number().int().min(1),
  playerName: z
    .string()
    .min(2)
    .max(100)
    .refine((val) => !containsProfanity(val), {
      message: "Oyuncu adı uygunsuz içerik barındırıyor",
    }),
  psnId: z
    .string()
    .min(2)
    .max(100)
    .refine((val) => !containsProfanity(val), {
      message: "PSN/Konami ID uygunsuz içerik barındırıyor",
    }),
  teamSelection: z
    .string()
    .min(2)
    .max(100)
    .refine((val) => !containsProfanity(val), {
      message: "Takım seçimi uygunsuz içerik barındırıyor",
    }),
});

export async function getSessionSlots(sessionId: number) {
  if (!(await requireAdmin())) {
    return [];
  }

  return db
    .select()
    .from(slots)
    .where(eq(slots.sessionId, sessionId))
    .orderBy(slots.slotNumber);
}

export async function addSlotManually(
  sessionId: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const session = await db
      .select()
      .from(scrimSessions)
      .where(eq(scrimSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return { success: false, message: "Turnuva bulunamadı" };
    }

    const currentSession = session[0];

    const rawData = {
      slotNumber: formData.get("slotNumber"),
      playerName: formData.get("playerName"),
      psnId: formData.get("psnId"),
      teamSelection: formData.get("teamSelection"),
    };

    const parsed = addSlotSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const { slotNumber, playerName, psnId, teamSelection } = parsed.data;

    if (slotNumber > currentSession.maxSlots) {
      return {
        success: false,
        message: `Bu turnuva için geçerli kontenjan aralığı 1-${currentSession.maxSlots}.`,
      };
    }

    const existingSlot = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.slotNumber, slotNumber)))
      .limit(1);

    if (existingSlot.length > 0) {
      if (existingSlot[0].isLocked) {
        return { success: false, message: `Kontenjan #${slotNumber} kilitli` };
      }
      return { success: false, message: `Kontenjan #${slotNumber} zaten dolu` };
    }

    await db.insert(slots).values({
      sessionId,
      slotNumber,
      playerName,
      psnId,
      teamSelection,
      teamName: playerName,
      instagram: null,
      ipAddress: "admin-added",
      playerNames: [playerName],
      isLocked: false,
    });

    revalidatePath(`/admin/scrims/${sessionId}`);
    revalidatePath("/");

    return { success: true, message: `Oyuncu kontenjan #${slotNumber}'a eklendi` };
  } catch (error) {
    console.error("Add slot error:", error);
    return { success: false, message: "Oyuncu eklenemedi" };
  }
}

export async function deleteSlot(slotId: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    await db.delete(slots).where(eq(slots.id, slotId));
    revalidatePath("/admin/scrims");
    revalidatePath("/");
    return { success: true, message: "Kontenjan başarıyla silindi" };
  } catch (error) {
    console.error("Delete slot error:", error);
    return { success: false, message: "Kontenjan silinemedi" };
  }
}

export async function lockSlot(
  sessionId: number,
  slotNumber: number
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const session = await db
      .select({ maxSlots: scrimSessions.maxSlots })
      .from(scrimSessions)
      .where(eq(scrimSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return { success: false, message: "Turnuva bulunamadı" };
    }

    if (slotNumber > session[0].maxSlots) {
      return {
        success: false,
        message: `Bu turnuva için geçerli kontenjan aralığı 1-${session[0].maxSlots}.`,
      };
    }

    const existingSlot = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.slotNumber, slotNumber)))
      .limit(1);

    if (existingSlot.length > 0 && !existingSlot[0].isLocked) {
      return { success: false, message: "Kontenjan dolu, kilitlenemez" };
    }

    if (existingSlot.length === 0) {
      await db.insert(slots).values({
        sessionId,
        slotNumber,
        isLocked: true,
      });
    }

    revalidatePath(`/admin/scrims/${sessionId}`);
    revalidatePath("/");
    return { success: true, message: `Kontenjan #${slotNumber} kilitlendi` };
  } catch (error) {
    console.error("Lock slot error:", error);
    return { success: false, message: "Kontenjan kilitlenemedi" };
  }
}

export async function unlockSlot(
  sessionId: number,
  slotNumber: number
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const session = await db
      .select({ maxSlots: scrimSessions.maxSlots })
      .from(scrimSessions)
      .where(eq(scrimSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return { success: false, message: "Turnuva bulunamadı" };
    }

    if (slotNumber > session[0].maxSlots) {
      return {
        success: false,
        message: `Bu turnuva için geçerli kontenjan aralığı 1-${session[0].maxSlots}.`,
      };
    }

    const existingSlot = await db
      .select()
      .from(slots)
      .where(and(eq(slots.sessionId, sessionId), eq(slots.slotNumber, slotNumber)))
      .limit(1);

    if (existingSlot.length === 0) {
      return { success: true, message: "Kontenjan zaten açık" };
    }

    if (!existingSlot[0].isLocked) {
      return { success: false, message: "Kontenjan dolu, açılamaz" };
    }

    await db.delete(slots).where(eq(slots.id, existingSlot[0].id));

    revalidatePath(`/admin/scrims/${sessionId}`);
    revalidatePath("/");
    return { success: true, message: `Kontenjan #${slotNumber} açıldı` };
  } catch (error) {
    console.error("Unlock slot error:", error);
    return { success: false, message: "Kontenjan açılamadı" };
  }
}

// Settings Management
const settingsSchema = z.object({
  isMaintenance: z.coerce.boolean(),
  announcement: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .refine((val) => !val || !containsProfanity(val), {
      message: "Duyuru uygunsuz içerik barındırıyor",
    }),
});

export async function updateSettings(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      isMaintenance: formData.get("isMaintenance") === "true",
      announcement: formData.get("announcement") || null,
    };

    const parsed = settingsSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const existingSettings = await db
      .select()
      .from(settings)
      .orderBy(desc(settings.updatedAt), desc(settings.id))
      .limit(1);

    if (existingSettings.length === 0) {
      await db.insert(settings).values({
        isMaintenance: parsed.data.isMaintenance,
        announcement: parsed.data.announcement,
      });
    } else {
      await db
        .update(settings)
        .set({
          isMaintenance: parsed.data.isMaintenance,
          announcement: parsed.data.announcement,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existingSettings[0].id));
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true, message: "Ayarlar başarıyla güncellendi" };
  } catch (error) {
    console.error("Update settings error:", error);
    return { success: false, message: "Ayarlar güncellenemedi" };
  }
}

// Leaderboard Management (Multi)
const leaderboardMetaSchema = z.object({
  title: z
    .string()
    .min(2, "Başlık en az 2 karakter olmalıdır")
    .max(200, "Başlık 200 karakterden az olmalıdır")
    .refine((val) => !containsProfanity(val), {
      message: "Başlık uygunsuz içerik barındırıyor",
    }),
  slug: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : "")),
  status: z.enum(["active", "archived"]),
});

const leaderboardEntrySchema = z.object({
  teamName: z
    .string()
    .min(2)
    .max(100)
    .refine((val) => !containsProfanity(val), {
      message: "Oyuncu adı uygunsuz içerik barındırıyor",
    }),
  points: z.coerce.number().int().min(0),
  wins: z.coerce.number().int().min(0),
  kills: z.coerce.number().int().min(0),
  matchesPlayed: z.coerce.number().int().min(0),
});

async function generateUniqueLeaderboardSlug(base: string, excludeId?: number) {
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: leaderboards.id })
      .from(leaderboards)
      .where(
        excludeId
          ? and(eq(leaderboards.slug, slug), ne(leaderboards.id, excludeId))
          : eq(leaderboards.slug, slug)
      )
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    counter += 1;
    slug = `${base}-${counter}`;
  }
}

async function getLeaderboardMeta(leaderboardId: number) {
  const result = await db
    .select({ slug: leaderboards.slug, isMain: leaderboards.isMain })
    .from(leaderboards)
    .where(eq(leaderboards.id, leaderboardId))
    .limit(1);

  return result[0] || null;
}

export async function getLeaderboardsAdmin() {
  if (!(await requireAdmin())) {
    return [];
  }

  const [boards, entries] = await Promise.all([
    db
      .select()
      .from(leaderboards)
      .orderBy(desc(leaderboards.isMain), asc(leaderboards.status), asc(leaderboards.title)),
    db.select({ leaderboardId: leaderboardEntries.leaderboardId }).from(leaderboardEntries),
  ]);

  const counts = entries.reduce<Record<number, number>>((acc, entry) => {
    acc[entry.leaderboardId] = (acc[entry.leaderboardId] || 0) + 1;
    return acc;
  }, {});

  return boards.map((board) => ({
    ...board,
    entryCount: counts[board.id] || 0,
  }));
}

export async function getLeaderboardAdmin(id: number) {
  if (!(await requireAdmin())) {
    return null;
  }

  const result = await db
    .select()
    .from(leaderboards)
    .where(eq(leaderboards.id, id))
    .limit(1);

  return result[0] || null;
}

export async function createLeaderboard(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      status: formData.get("status"),
    };

    const parsed = leaderboardMetaSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const baseSlug = slugify(parsed.data.slug || parsed.data.title);
    const uniqueSlug = await generateUniqueLeaderboardSlug(baseSlug);

    await db.insert(leaderboards).values({
      title: parsed.data.title,
      slug: uniqueSlug,
      status: parsed.data.status as LeaderboardStatus,
      updatedAt: new Date(),
    });

    revalidatePath("/leaderboard");
    revalidatePath("/admin/leaderboard");

    return { success: true, message: "Liderlik tablosu oluşturuldu" };
  } catch (error) {
    console.error("Create leaderboard error:", error);
    return { success: false, message: "Liderlik tablosu oluşturulamadı" };
  }
}

export async function updateLeaderboard(
  leaderboardId: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      status: formData.get("status"),
    };

    const parsed = leaderboardMetaSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const existing = await getLeaderboardMeta(leaderboardId);
    if (!existing) {
      return { success: false, message: "Liderlik tablosu bulunamadı" };
    }

    const baseSlug = slugify(parsed.data.slug || parsed.data.title);
    const uniqueSlug = await generateUniqueLeaderboardSlug(baseSlug, leaderboardId);

    await db
      .update(leaderboards)
      .set({
        title: parsed.data.title,
        slug: uniqueSlug,
        status: parsed.data.status as LeaderboardStatus,
        updatedAt: new Date(),
      })
      .where(eq(leaderboards.id, leaderboardId));

    revalidatePath("/leaderboard");
    revalidatePath(`/leaderboard/${uniqueSlug}`);
    if (existing.slug !== uniqueSlug) {
      revalidatePath(`/leaderboard/${existing.slug}`);
    }
    revalidatePath("/admin/leaderboard");
    revalidatePath(`/admin/leaderboard/${leaderboardId}`);
    if (existing.isMain) {
      revalidatePath("/");
    }

    return { success: true, message: "Liderlik tablosu güncellendi" };
  } catch (error) {
    console.error("Update leaderboard error:", error);
    return { success: false, message: "Liderlik tablosu güncellenemedi" };
  }
}

export async function deleteLeaderboard(leaderboardId: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const existing = await getLeaderboardMeta(leaderboardId);
    await db.delete(leaderboards).where(eq(leaderboards.id, leaderboardId));
    revalidatePath("/leaderboard");
    revalidatePath("/admin/leaderboard");
    if (existing?.slug) {
      revalidatePath(`/leaderboard/${existing.slug}`);
    }
    if (existing?.isMain) {
      revalidatePath("/");
    }
    return { success: true, message: "Liderlik tablosu silindi" };
  } catch (error) {
    console.error("Delete leaderboard error:", error);
    return { success: false, message: "Liderlik tablosu silinemedi" };
  }
}

export async function setMainLeaderboard(leaderboardId: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.update(leaderboards).set({ isMain: false, updatedAt: new Date() });
      await tx
        .update(leaderboards)
        .set({ isMain: true, status: "active", updatedAt: new Date() })
        .where(eq(leaderboards.id, leaderboardId));
    });

    const meta = await getLeaderboardMeta(leaderboardId);
    revalidatePath("/");
    revalidatePath("/leaderboard");
    if (meta?.slug) {
      revalidatePath(`/leaderboard/${meta.slug}`);
    }
    revalidatePath("/admin/leaderboard");

    return { success: true, message: "Ana liderlik tablosu güncellendi" };
  } catch (error) {
    console.error("Set main leaderboard error:", error);
    return { success: false, message: "Ana liderlik tablosu güncellenemedi" };
  }
}

export async function getLeaderboardEntriesAdmin(leaderboardId: number) {
  if (!(await requireAdmin())) {
    return [];
  }

  return db
    .select()
    .from(leaderboardEntries)
    .where(eq(leaderboardEntries.leaderboardId, leaderboardId))
    .orderBy(desc(leaderboardEntries.points), asc(leaderboardEntries.teamName));
}

export async function createLeaderboardEntry(
  leaderboardId: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const meta = await getLeaderboardMeta(leaderboardId);
    if (!meta) {
      return { success: false, message: "Liderlik tablosu bulunamadı" };
    }

    const rawData = {
      teamName: formData.get("teamName"),
      points: formData.get("points"),
      wins: formData.get("wins"),
      kills: formData.get("kills"),
      matchesPlayed: formData.get("matchesPlayed"),
    };

    const parsed = leaderboardEntrySchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    await db.insert(leaderboardEntries).values({
      leaderboardId,
      teamName: parsed.data.teamName,
      points: parsed.data.points,
      wins: parsed.data.wins,
      kills: parsed.data.kills,
      matchesPlayed: parsed.data.matchesPlayed,
      updatedAt: new Date(),
    });

    revalidatePath("/leaderboard");
    if (meta?.slug) {
      revalidatePath(`/leaderboard/${meta.slug}`);
    }
    revalidatePath(`/admin/leaderboard/${leaderboardId}`);
    if (meta?.isMain) {
      revalidatePath("/");
    }
    return { success: true, message: "Oyuncu başarıyla eklendi" };
  } catch (error) {
    console.error("Create leaderboard entry error:", error);
    return { success: false, message: "Oyuncu eklenemedi" };
  }
}

export async function updateLeaderboardEntry(
  entryId: number,
  leaderboardId: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const meta = await getLeaderboardMeta(leaderboardId);
    if (!meta) {
      return { success: false, message: "Liderlik tablosu bulunamadı" };
    }

    const rawData = {
      teamName: formData.get("teamName"),
      points: formData.get("points"),
      wins: formData.get("wins"),
      kills: formData.get("kills"),
      matchesPlayed: formData.get("matchesPlayed"),
    };

    const parsed = leaderboardEntrySchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    await db
      .update(leaderboardEntries)
      .set({
        teamName: parsed.data.teamName,
        points: parsed.data.points,
        wins: parsed.data.wins,
        kills: parsed.data.kills,
        matchesPlayed: parsed.data.matchesPlayed,
        updatedAt: new Date(),
      })
      .where(eq(leaderboardEntries.id, entryId));

    revalidatePath("/leaderboard");
    if (meta?.slug) {
      revalidatePath(`/leaderboard/${meta.slug}`);
    }
    revalidatePath(`/admin/leaderboard/${leaderboardId}`);
    if (meta?.isMain) {
      revalidatePath("/");
    }
    return { success: true, message: "Oyuncu güncellendi" };
  } catch (error) {
    console.error("Update leaderboard entry error:", error);
    return { success: false, message: "Oyuncu güncellenemedi" };
  }
}

export async function deleteLeaderboardEntry(
  entryId: number,
  leaderboardId: number
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const meta = await getLeaderboardMeta(leaderboardId);
    if (!meta) {
      return { success: false, message: "Liderlik tablosu bulunamadı" };
    }

    await db.delete(leaderboardEntries).where(eq(leaderboardEntries.id, entryId));
    revalidatePath("/leaderboard");
    if (meta?.slug) {
      revalidatePath(`/leaderboard/${meta.slug}`);
    }
    revalidatePath(`/admin/leaderboard/${leaderboardId}`);
    if (meta?.isMain) {
      revalidatePath("/");
    }
    return { success: true, message: "Oyuncu silindi" };
  } catch (error) {
    console.error("Delete leaderboard entry error:", error);
    return { success: false, message: "Oyuncu silinemedi" };
  }
}

export async function getAdminStats() {
  const [sessions, settingsData, leaderboardCount] = await Promise.all([
    db.select().from(scrimSessions),
    db
      .select()
      .from(settings)
      .orderBy(desc(settings.updatedAt), desc(settings.id))
      .limit(1),
    db.select().from(leaderboardEntries),
  ]);

  const now = new Date();
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const upcomingSessions = sessions.filter(
    (s) => s.status !== "completed" && s.startTime > now
  ).length;
  const completedSessions = sessions.filter((s) => s.status === "completed").length;

  return {
    totalSessions: sessions.length,
    activeSessions,
    upcomingSessions,
    completedSessions,
    settings: settingsData[0] || null,
    teamsInLeaderboard: leaderboardCount.length,
  };
}

export async function getLatestSessionWithSlots() {
  const session = await db
    .select()
    .from(scrimSessions)
    .orderBy(desc(scrimSessions.startTime))
    .limit(1);

  if (session.length === 0) {
    return { session: null, slots: [] };
  }

  const sessionSlots = await db
    .select()
    .from(slots)
    .where(eq(slots.sessionId, session[0].id))
    .orderBy(asc(slots.slotNumber));

  return { session: session[0], slots: sessionSlots };
}

// Rules & Point System Management
const ruleCardSchema = z.object({
  iconKey: z.enum(["clock", "users", "shield", "target"]),
  title: z
    .string()
    .min(2, "Başlık en az 2 karakter olmalı")
    .max(100, "Başlık en fazla 100 karakter olabilir"),
  description: z
    .string()
    .min(10, "Açıklama en az 10 karakter olmalı")
    .max(500, "Açıklama en fazla 500 karakter olabilir"),
});

const pointSystemItemSchema = z.object({
  position: z
    .string()
    .min(1, "Sıra boş olamaz")
    .max(50, "Sıra en fazla 50 karakter olabilir"),
  points: z.coerce
    .number()
    .int()
    .min(0, "Puan 0 veya daha büyük olmalı")
    .max(100, "Puan en fazla 100 olabilir"),
});

const rulesConfigSchema = z.object({
  ruleCards: z
    .array(ruleCardSchema)
    .min(1, "En az bir kural kartı olmalı")
    .max(10, "En fazla 10 kural kartı olabilir"),
  dos: z
    .array(
      z
        .string()
        .min(2, "Madde en az 2 karakter olmalı")
        .max(200, "Madde en fazla 200 karakter olabilir")
    )
    .min(1, "En az bir 'Yapılması Gereken' olmalı")
    .max(15, "En fazla 15 madde olabilir"),
  donts: z
    .array(
      z
        .string()
        .min(2, "Madde en az 2 karakter olmalı")
        .max(200, "Madde en fazla 200 karakter olabilir")
    )
    .min(1, "En az bir 'Yapılmaması Gereken' olmalı")
    .max(15, "En fazla 15 madde olabilir"),
  pointSystem: z
    .array(pointSystemItemSchema)
    .min(1, "En az bir puan sırası olmalı")
    .max(20, "En fazla 20 sıra olabilir"),
});

export async function getRulesConfig(): Promise<RulesConfig> {
  const result = await db.select().from(settings).limit(1);

  if (result.length === 0 || !result[0].ruleCards) {
    return DEFAULT_RULES_CONFIG;
  }

  return {
    ruleCards:
      (result[0].ruleCards as RuleCard[]) ?? DEFAULT_RULES_CONFIG.ruleCards,
    dos: (result[0].dos as string[]) ?? DEFAULT_RULES_CONFIG.dos,
    donts: (result[0].donts as string[]) ?? DEFAULT_RULES_CONFIG.donts,
    pointSystem:
      (result[0].pointSystem as PointSystemItem[]) ??
      DEFAULT_RULES_CONFIG.pointSystem,
  };
}

export async function updateRulesConfig(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const rawData = JSON.parse(formData.get("rulesConfig") as string);
    const parsed = rulesConfigSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const existingSettings = await db.select().from(settings).limit(1);

    if (existingSettings.length === 0) {
      await db.insert(settings).values({
        ruleCards: parsed.data.ruleCards,
        dos: parsed.data.dos,
        donts: parsed.data.donts,
        pointSystem: parsed.data.pointSystem,
      });
    } else {
      await db
        .update(settings)
        .set({
          ruleCards: parsed.data.ruleCards,
          dos: parsed.data.dos,
          donts: parsed.data.donts,
          pointSystem: parsed.data.pointSystem,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existingSettings[0].id));
    }

    revalidatePath("/rules");
    revalidatePath("/admin/rules");
    return { success: true, message: "Kurallar güncellendi" };
  } catch (error) {
    console.error("Update rules error:", error);
    return { success: false, message: "Kurallar güncellenemedi" };
  }
}
