import type { MetadataRoute } from "next";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { db, posts, scrimSessions, leaderboards } from "@/lib/db";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.baseUrl.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/scrims`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  const publishedPosts = await db
    .select({
      slug: posts.slug,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), desc(posts.updatedAt));

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const recentCutoff = new Date();
  recentCutoff.setDate(recentCutoff.getDate() - 30);

  const activeClosedScrims = await db
    .select({
      slug: scrimSessions.slug,
      updatedAt: scrimSessions.updatedAt,
      startTime: scrimSessions.startTime,
    })
    .from(scrimSessions)
    .where(inArray(scrimSessions.status, ["active", "closed"]));

  const recentCompletedScrims = await db
    .select({
      slug: scrimSessions.slug,
      updatedAt: scrimSessions.updatedAt,
      startTime: scrimSessions.startTime,
    })
    .from(scrimSessions)
    .where(
      and(
        eq(scrimSessions.status, "completed"),
        gte(scrimSessions.startTime, recentCutoff)
      )
    );

  const scrimRoutes: MetadataRoute.Sitemap = [...activeClosedScrims, ...recentCompletedScrims].map(
    (scrim) => ({
      url: `${baseUrl}/scrims/${scrim.slug}`,
      lastModified: scrim.updatedAt || scrim.startTime || new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    })
  );

  const leaderboardList = await db
    .select({
      slug: leaderboards.slug,
      updatedAt: leaderboards.updatedAt,
      createdAt: leaderboards.createdAt,
    })
    .from(leaderboards);

  const leaderboardRoutes: MetadataRoute.Sitemap = leaderboardList.map((board) => ({
    url: `${baseUrl}/leaderboard/${board.slug}`,
    lastModified: board.updatedAt || board.createdAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...scrimRoutes, ...leaderboardRoutes];
}
