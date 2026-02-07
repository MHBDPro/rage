"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, sponsors, type SponsorSocialLinks } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth/jwt";

export type ActionResponse = {
  success: boolean;
  message: string;
};

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

// Zod Schemas
const socialLinksSchema = z
  .object({
    instagram: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    discord: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    twitch: z.string().url().optional().or(z.literal("")),
  })
  .optional()
  .nullable();

const sponsorSchema = z.object({
  name: z
    .string()
    .min(2, "Sponsor adı en az 2 karakter olmalı")
    .max(100, "Sponsor adı en fazla 100 karakter olabilir"),
  logoUrl: z.string().url("Geçersiz logo URL"),
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .nullable(),
  websiteUrl: z.string().url("Geçersiz website URL").optional().or(z.literal("")),
  tier: z.enum(["gold", "silver", "bronze"], {
    message: "Geçersiz tier seçimi",
  }),
  isActive: z.coerce.boolean(),
  displayOrder: z.coerce.number().int().min(0),
  socialLinks: socialLinksSchema,
});

// ============================================
// READ ACTIONS (Public)
// ============================================

export async function getSponsors(activeOnly = false) {
  if (activeOnly) {
    return db
      .select()
      .from(sponsors)
      .where(eq(sponsors.isActive, true))
      .orderBy(asc(sponsors.displayOrder));
  }
  return db.select().from(sponsors).orderBy(asc(sponsors.displayOrder));
}

export async function getSponsorsByTier(tier: "gold" | "silver" | "bronze") {
  return db
    .select()
    .from(sponsors)
    .where(eq(sponsors.tier, tier))
    .orderBy(asc(sponsors.displayOrder));
}

export async function getActiveSponsorsGroupedByTier() {
  const allSponsors = await db
    .select()
    .from(sponsors)
    .where(eq(sponsors.isActive, true))
    .orderBy(asc(sponsors.displayOrder));

  return {
    gold: allSponsors.filter((s) => s.tier === "gold"),
    silver: allSponsors.filter((s) => s.tier === "silver"),
    bronze: allSponsors.filter((s) => s.tier === "bronze"),
  };
}

// ============================================
// ADMIN CRUD ACTIONS
// ============================================

export async function addSponsor(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const socialLinksRaw = formData.get("socialLinks");
    let socialLinks: SponsorSocialLinks | null = null;

    if (socialLinksRaw && typeof socialLinksRaw === "string") {
      try {
        const parsed = JSON.parse(socialLinksRaw);
        // Filter out empty strings
        socialLinks = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => v && v !== "")
        ) as SponsorSocialLinks;
        if (Object.keys(socialLinks).length === 0) {
          socialLinks = null;
        }
      } catch {
        socialLinks = null;
      }
    }

    const rawData = {
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl"),
      description: formData.get("description") || null,
      websiteUrl: formData.get("websiteUrl") || "",
      tier: formData.get("tier"),
      isActive: formData.get("isActive") === "true",
      displayOrder: formData.get("displayOrder") || 0,
      socialLinks,
    };

    const parsed = sponsorSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    await db.insert(sponsors).values({
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl,
      description: parsed.data.description,
      websiteUrl: parsed.data.websiteUrl || null,
      tier: parsed.data.tier,
      isActive: parsed.data.isActive,
      displayOrder: parsed.data.displayOrder,
      socialLinks: parsed.data.socialLinks as SponsorSocialLinks,
    });

    revalidatePath("/");
    revalidatePath("/sponsors");
    revalidatePath("/admin/sponsors");
    return { success: true, message: "Sponsor başarıyla eklendi" };
  } catch (error) {
    console.error("Add sponsor error:", error);
    return { success: false, message: "Sponsor eklenemedi" };
  }
}

export async function updateSponsor(
  id: number,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const socialLinksRaw = formData.get("socialLinks");
    let socialLinks: SponsorSocialLinks | null = null;

    if (socialLinksRaw && typeof socialLinksRaw === "string") {
      try {
        const parsed = JSON.parse(socialLinksRaw);
        socialLinks = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => v && v !== "")
        ) as SponsorSocialLinks;
        if (Object.keys(socialLinks).length === 0) {
          socialLinks = null;
        }
      } catch {
        socialLinks = null;
      }
    }

    const rawData = {
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl"),
      description: formData.get("description") || null,
      websiteUrl: formData.get("websiteUrl") || "",
      tier: formData.get("tier"),
      isActive: formData.get("isActive") === "true",
      displayOrder: formData.get("displayOrder") || 0,
      socialLinks,
    };

    const parsed = sponsorSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    await db
      .update(sponsors)
      .set({
        name: parsed.data.name,
        logoUrl: parsed.data.logoUrl,
        description: parsed.data.description,
        websiteUrl: parsed.data.websiteUrl || null,
        tier: parsed.data.tier,
        isActive: parsed.data.isActive,
        displayOrder: parsed.data.displayOrder,
        socialLinks: parsed.data.socialLinks as SponsorSocialLinks,
        updatedAt: new Date(),
      })
      .where(eq(sponsors.id, id));

    revalidatePath("/");
    revalidatePath("/sponsors");
    revalidatePath("/admin/sponsors");
    return { success: true, message: "Sponsor başarıyla güncellendi" };
  } catch (error) {
    console.error("Update sponsor error:", error);
    return { success: false, message: "Sponsor güncellenemedi" };
  }
}

export async function deleteSponsor(id: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    await db.delete(sponsors).where(eq(sponsors.id, id));
    revalidatePath("/");
    revalidatePath("/sponsors");
    revalidatePath("/admin/sponsors");
    return { success: true, message: "Sponsor başarıyla silindi" };
  } catch (error) {
    console.error("Delete sponsor error:", error);
    return { success: false, message: "Sponsor silinemedi" };
  }
}

export async function getSponsorsStats() {
  const allSponsors = await db.select().from(sponsors);

  return {
    total: allSponsors.length,
    active: allSponsors.filter((s) => s.isActive).length,
    gold: allSponsors.filter((s) => s.tier === "gold").length,
    silver: allSponsors.filter((s) => s.tier === "silver").length,
    bronze: allSponsors.filter((s) => s.tier === "bronze").length,
  };
}
