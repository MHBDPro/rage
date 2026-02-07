"use server";

import { db, leaderboards, leaderboardEntries } from "@/lib/db";
import { asc, desc, eq } from "drizzle-orm";

export async function getLeaderboardsIndex() {
  const [boards, entries] = await Promise.all([
    db
      .select()
      .from(leaderboards)
      .orderBy(desc(leaderboards.isMain), asc(leaderboards.status), asc(leaderboards.title)),
    db
      .select({
        leaderboardId: leaderboardEntries.leaderboardId,
        teamName: leaderboardEntries.teamName,
        points: leaderboardEntries.points,
      })
      .from(leaderboardEntries)
      .orderBy(desc(leaderboardEntries.points), asc(leaderboardEntries.teamName)),
  ]);

  const counts = entries.reduce<Record<number, number>>((acc, entry) => {
    acc[entry.leaderboardId] = (acc[entry.leaderboardId] || 0) + 1;
    return acc;
  }, {});

  const topTeams = entries.reduce<Record<number, string>>((acc, entry) => {
    if (!acc[entry.leaderboardId]) {
      acc[entry.leaderboardId] = entry.teamName;
    }
    return acc;
  }, {});

  return boards.map((board) => ({
    ...board,
    entryCount: counts[board.id] || 0,
    topTeam: topTeams[board.id] || null,
  }));
}

export async function getLeaderboardBySlug(slug: string) {
  const result = await db
    .select()
    .from(leaderboards)
    .where(eq(leaderboards.slug, slug))
    .limit(1);

  const leaderboard = result[0];
  if (!leaderboard) {
    return null;
  }

  const entries = await db
    .select()
    .from(leaderboardEntries)
    .where(eq(leaderboardEntries.leaderboardId, leaderboard.id))
    .orderBy(desc(leaderboardEntries.points), asc(leaderboardEntries.teamName));

  return { leaderboard, entries };
}

export async function getMainLeaderboardChampion() {
  const result = await db
    .select({
      id: leaderboards.id,
      title: leaderboards.title,
    })
    .from(leaderboards)
    .where(eq(leaderboards.isMain, true))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const leaderboard = result[0];
  const entries = await db
    .select({
      teamName: leaderboardEntries.teamName,
      points: leaderboardEntries.points,
    })
    .from(leaderboardEntries)
    .where(eq(leaderboardEntries.leaderboardId, leaderboard.id))
    .orderBy(desc(leaderboardEntries.points), asc(leaderboardEntries.teamName))
    .limit(1);

  if (entries.length === 0) {
    return null;
  }

  return {
    teamName: entries[0].teamName,
    points: entries[0].points,
    leaderboardTitle: leaderboard.title,
  };
}
