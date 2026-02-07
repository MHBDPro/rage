"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { LeaderboardEntry } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface LeaderboardDetailProps {
  entries: LeaderboardEntry[];
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, type: "spring", stiffness: 220, damping: 24 },
  }),
};

function getRankVisual(rank: number) {
  if (rank === 1) {
    return {
      label: siteConfig.ui.leaderboard.goldLabel,
      color: "var(--color-gold)",
      bg: "rgba(var(--accent-rgb), 0.08)",
      border: "rgba(var(--accent-rgb), 0.35)",
      glow: "0 0 20px rgba(var(--accent-rgb), 0.35)",
    };
  }

  if (rank === 2) {
    return {
      label: siteConfig.ui.leaderboard.silverLabel,
      color: "var(--primary)",
      bg: "rgba(var(--primary-rgb), 0.08)",
      border: "rgba(var(--primary-rgb), 0.35)",
      glow: "0 0 18px rgba(var(--primary-rgb), 0.3)",
    };
  }

  if (rank === 3) {
    return {
      label: siteConfig.ui.leaderboard.bronzeLabel,
      color: "color-mix(in srgb, var(--color-gold) 55%, var(--destructive) 45%)",
      bg: "color-mix(in srgb, rgba(var(--accent-rgb), 0.12) 55%, rgba(var(--destructive-rgb), 0.12) 45%)",
      border: "color-mix(in srgb, rgba(var(--accent-rgb), 0.4) 55%, rgba(var(--destructive-rgb), 0.4) 45%)",
      glow: "0 0 18px rgba(var(--accent-rgb), 0.2)",
    };
  }

  return null;
}

export function LeaderboardDetail({ entries }: LeaderboardDetailProps) {
  if (entries.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        {siteConfig.ui.leaderboard.noData}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
              {siteConfig.ui.leaderboard.rank}
            </th>
            <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
              {siteConfig.ui.leaderboard.team}
            </th>
            <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
              {siteConfig.ui.leaderboard.points}
            </th>
            <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
              {siteConfig.ui.leaderboard.wins}
            </th>
            <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
              {siteConfig.ui.leaderboard.kills}
            </th>
            <th className="pb-3 text-center text-xs font-semibold uppercase text-muted-foreground">
              {siteConfig.ui.leaderboard.matches}
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const rank = index + 1;
            const visual = getRankVisual(rank);

            return (
              <motion.tr
                key={entry.id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="border-b border-border/50"
                style={
                  visual
                    ? {
                        background: visual.bg,
                        borderColor: visual.border,
                        boxShadow: visual.glow,
                      }
                    : undefined
                }
              >
                <td className="py-3">
                  {visual ? (
                    <Badge className="border border-border/50 bg-transparent" style={{ color: visual.color }}>
                      {visual.label} #{rank}
                    </Badge>
                  ) : (
                    <Badge variant="default">#{rank}</Badge>
                  )}
                </td>
                <td className="py-3 font-semibold">
                  {entry.teamName}
                </td>
                <td className="py-3 text-center">
                  <span className="font-bold text-primary">{entry.points}</span>
                </td>
                <td className="py-3 text-center text-muted-foreground">
                  {entry.wins}
                </td>
                <td className="py-3 text-center text-muted-foreground">
                  {entry.kills}
                </td>
                <td className="py-3 text-center text-muted-foreground">
                  {entry.matchesPlayed}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
