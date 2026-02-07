"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, posts } from "@/lib/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { getSession } from "@/lib/auth/jwt";
import { slugify } from "@/lib/utils";

export type ActionResponse = {
  success: boolean;
  message: string;
};

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

const postSchema = z.object({
  title: z
    .string()
    .min(2, "Başlık en az 2 karakter olmalıdır")
    .max(200, "Başlık 200 karakterden az olmalıdır"),
  slug: z
    .string()
    .max(200, "Slug 200 karakterden az olmalıdır")
    .optional()
    .nullable()
    .transform((val) => (val ? val : "")),
  excerpt: z
    .string()
    .min(10, "Özet en az 10 karakter olmalıdır")
    .max(300, "Özet 300 karakterden az olmalıdır"),
  content: z.string().min(20, "İçerik en az 20 karakter olmalıdır"),
  coverImage: z
    .string()
    .url("Geçersiz kapak görseli URL")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val && val.length > 0 ? val : null)),
  published: z.coerce.boolean(),
  author: z
    .string()
    .min(2, "Yazar adı en az 2 karakter olmalıdır")
    .max(100, "Yazar adı 100 karakterden az olmalıdır"),
});

async function generateUniqueSlug(base: string, excludeId?: number) {
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        excludeId
          ? and(eq(posts.slug, slug), ne(posts.id, excludeId))
          : eq(posts.slug, slug)
      )
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    counter += 1;
    slug = `${base}-${counter}`;
  }
}

// ============================================
// PUBLIC READ ACTIONS
// ============================================

export async function getPublishedPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
}

export async function getPublishedPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);

  return result[0] || null;
}

// ============================================
// ADMIN ACTIONS
// ============================================

export async function getPostsAdmin() {
  if (!(await requireAdmin())) {
    return [];
  }

  return db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function createPost(
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
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      coverImage: formData.get("coverImage"),
      published: formData.get("published") === "true",
      author: formData.get("author"),
    };

    const parsed = postSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const baseSlug = parsed.data.slug || slugify(parsed.data.title);
    const slug = await generateUniqueSlug(baseSlug);
    const publishedAt = parsed.data.published ? new Date() : null;

    await db.insert(posts).values({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage,
      published: parsed.data.published,
      author: parsed.data.author,
      publishedAt,
    });

    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);
    revalidatePath("/admin/news");

    return { success: true, message: "Blog içeriği oluşturuldu" };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, message: "İçerik oluşturulamadı" };
  }
}

export async function updatePost(
  id: number,
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
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      coverImage: formData.get("coverImage"),
      published: formData.get("published") === "true",
      author: formData.get("author"),
    };

    const parsed = postSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const existing = await db
      .select({ published: posts.published, publishedAt: posts.publishedAt })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (existing.length === 0) {
      return { success: false, message: "İçerik bulunamadı" };
    }

    const baseSlug = parsed.data.slug || slugify(parsed.data.title);
    const slug = await generateUniqueSlug(baseSlug, id);

    let publishedAt = existing[0].publishedAt;
    if (parsed.data.published && !existing[0].published) {
      publishedAt = new Date();
    }
    if (!parsed.data.published) {
      publishedAt = null;
    }

    await db
      .update(posts)
      .set({
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        published: parsed.data.published,
        author: parsed.data.author,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));

    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);
    revalidatePath("/admin/news");

    return { success: true, message: "Blog içeriği güncellendi" };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, message: "İçerik güncellenemedi" };
  }
}

export async function deletePost(id: number): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    await db.delete(posts).where(eq(posts.id, id));

    revalidatePath("/news");
    revalidatePath("/admin/news");

    return { success: true, message: "İçerik silindi" };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, message: "İçerik silinemedi" };
  }
}

export async function togglePostPublish(
  id: number,
  published: boolean
): Promise<ActionResponse> {
  if (!(await requireAdmin())) {
    return { success: false, message: "Yetkisiz erişim" };
  }

  try {
    const publishedAt = published ? new Date() : null;

    await db
      .update(posts)
      .set({
        published,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));

    revalidatePath("/news");
    revalidatePath("/admin/news");

    return {
      success: true,
      message: published ? "İçerik yayına alındı" : "İçerik taslağa alındı",
    };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return { success: false, message: "Yayın durumu değiştirilemedi" };
  }
}
