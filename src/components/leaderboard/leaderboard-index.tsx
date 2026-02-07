"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Crown, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Leaderboard } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface LeaderboardSummary extends Leaderboard {
  entryCount: number;
  topTeam: string | null;
}

interface LeaderboardIndexProps {
  boards: LeaderboardSummary[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 24 },
  },
};

const statusStyles = {
  active: "border-primary/40 bg-primary/10 text-primary",
  archived: "border-border bg-secondary/40 text-muted-foreground",
};

export function LeaderboardIndex({ boards }: LeaderboardIndexProps) {
  const activeBoards = boards.filter((board) => board.status === "active");
  const archivedBoards = boards.filter((board) => board.status === "archived");

  return (
    <div className="space-y-10">
      {activeBoards.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-foreground">
                <span className="text-primary mr-2">{"//"}</span>
                {siteConfig.ui.leaderboard.activeLabel}
              </h2>
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {activeBoards.map((board) => (
              <motion.div key={board.id} variants={itemVariants}>
                <Card variant="tactical" className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-foreground">
                          {board.title}
                        </h3>
                        {board.isMain && (
                          <Badge className="border-primary/40 bg-primary/10 text-primary">
                            <Crown className="mr-1 h-3.5 w-3.5" />
                            {siteConfig.ui.leaderboard.mainLabel}
                          </Badge>
                        )}
                        <Badge className={statusStyles[board.status]}>
                          {siteConfig.ui.leaderboard.activeLabel}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        /leaderboard/{board.slug}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {board.entryCount} {siteConfig.ui.leaderboard.entriesLabel}
                        </span>
                        {board.topTeam && (
                          <span>
                            {siteConfig.ui.leaderboard.topTeamLabel}: {board.topTeam}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/leaderboard/${board.slug}`}>
                        <Button variant="outline">
                          {siteConfig.ui.leaderboard.viewDetails}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {archivedBoards.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-foreground">
                <span className="text-primary mr-2">{"//"}</span>
                {siteConfig.ui.leaderboard.archivedLabel}
              </h2>
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {archivedBoards.map((board) => (
              <motion.div key={board.id} variants={itemVariants}>
                <Card variant="tactical" className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-foreground">
                          {board.title}
                        </h3>
                        {board.isMain && (
                          <Badge className="border-primary/40 bg-primary/10 text-primary">
                            <Crown className="mr-1 h-3.5 w-3.5" />
                            {siteConfig.ui.leaderboard.mainLabel}
                          </Badge>
                        )}
                        <Badge className={statusStyles[board.status]}>
                          {siteConfig.ui.leaderboard.archivedLabel}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        /leaderboard/{board.slug}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {board.entryCount} {siteConfig.ui.leaderboard.entriesLabel}
                        </span>
                        {board.topTeam && (
                          <span>
                            {siteConfig.ui.leaderboard.topTeamLabel}: {board.topTeam}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/leaderboard/${board.slug}`}>
                        <Button variant="outline">
                          {siteConfig.ui.leaderboard.viewDetails}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {activeBoards.length === 0 && archivedBoards.length === 0 && (
        <Card variant="glass" className="py-16 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground">
            {siteConfig.ui.leaderboard.emptyBoards}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.ui.leaderboard.indexSubtitle}
          </p>
        </Card>
      )}
    </div>
  );
}
