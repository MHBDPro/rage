"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Pencil, Plus, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  createLeaderboardEntry,
  deleteLeaderboardEntry,
  getLeaderboardAdmin,
  getLeaderboardEntriesAdmin,
  updateLeaderboardEntry,
} from "@/lib/actions/admin";
import type { Leaderboard, LeaderboardEntry } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, type: "spring", stiffness: 220, damping: 24 },
  }),
};

const statusStyles = {
  active: "border-primary/40 bg-primary/10 text-primary",
  archived: "border-border bg-secondary/40 text-muted-foreground",
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

export default function LeaderboardEntriesPage() {
  const params = useParams();
  const leaderboardId = Number(params.id);
  const [leaderboard, setLeaderboard] = React.useState<Leaderboard | null>(null);
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<LeaderboardEntry | null>(null);

  const loadData = React.useCallback(async () => {
    if (!Number.isFinite(leaderboardId)) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const [board, data] = await Promise.all([
      getLeaderboardAdmin(leaderboardId),
      getLeaderboardEntriesAdmin(leaderboardId),
    ]);
    setLeaderboard(board);
    setEntries(data);
    setIsLoading(false);
  }, [leaderboardId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async (formData: FormData) => {
    const result = await createLeaderboardEntry(leaderboardId, null, formData);
    if (result.success) {
      toast.success(result.message);
      setAddOpen(false);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedEntry) return;
    const result = await updateLeaderboardEntry(
      selectedEntry.id,
      leaderboardId,
      null,
      formData
    );
    if (result.success) {
      toast.success(result.message);
      setEditOpen(false);
      setSelectedEntry(null);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (entryId: number) => {
    const result = await deleteLeaderboardEntry(entryId, leaderboardId);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const openEditModal = (entry: LeaderboardEntry) => {
    setSelectedEntry(entry);
    setEditOpen(true);
  };

  if (!Number.isFinite(leaderboardId)) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        {siteConfig.ui.common.error}
      </div>
    );
  }

  if (!isLoading && !leaderboard) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        {siteConfig.ui.common.error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin/leaderboard">
                <Button variant="outline" size="sm">
                  {siteConfig.ui.common.back}
                </Button>
              </Link>
              {leaderboard?.isMain && (
                <Badge className="border-primary/40 bg-primary/10 text-primary">
                  {siteConfig.ui.leaderboard.mainLabel}
                </Badge>
              )}
              {leaderboard?.status && (
                <Badge className={statusStyles[leaderboard.status]}>
                  {leaderboard.status === "active"
                    ? siteConfig.ui.leaderboard.activeLabel
                    : siteConfig.ui.leaderboard.archivedLabel}
                </Badge>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              {leaderboard?.title || siteConfig.ui.leaderboard.title}
            </h1>
            {leaderboard?.slug && (
              <p className="text-muted-foreground">/leaderboard/{leaderboard.slug}</p>
            )}
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {siteConfig.ui.leaderboard.addTeamLabel}
          </Button>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {siteConfig.ui.leaderboard.manageEntriesLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 skeleton rounded-lg" />
                ))}
              </div>
            ) : entries.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                {siteConfig.ui.leaderboard.emptyEntries}
              </p>
            ) : (
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
                      <th className="pb-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                        {siteConfig.ui.common.edit}
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
                              <Badge
                                className="border border-border/50 bg-transparent"
                                style={{ color: visual.color }}
                              >
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
                            <span className="font-bold text-primary">
                              {entry.points}
                            </span>
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
                          <td className="py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(entry)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)}>
        <ModalHeader>
          <ModalTitle>{siteConfig.ui.leaderboard.addTeamLabel}</ModalTitle>
          <ModalDescription>{siteConfig.ui.leaderboard.manageEntriesLabel}</ModalDescription>
        </ModalHeader>
        <form action={handleAdd}>
          <ModalBody className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">{siteConfig.ui.forms.teamName}</label>
              <Input name="teamName" placeholder={siteConfig.ui.forms.teamNamePlaceholder} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.points}</label>
                <Input name="points" type="number" defaultValue="0" min="0" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.wins}</label>
                <Input name="wins" type="number" defaultValue="0" min="0" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.kills}</label>
                <Input name="kills" type="number" defaultValue="0" min="0" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.matches}</label>
                <Input name="matchesPlayed" type="number" defaultValue="0" min="0" required />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              {siteConfig.ui.common.close}
            </Button>
            <Button type="submit">{siteConfig.ui.common.save}</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedEntry(null);
        }}
      >
        <ModalHeader>
          <ModalTitle>{siteConfig.ui.leaderboard.editTeamLabel}</ModalTitle>
          <ModalDescription>{siteConfig.ui.leaderboard.manageEntriesLabel}</ModalDescription>
        </ModalHeader>
        {selectedEntry && (
          <form action={handleEdit}>
            <ModalBody className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.forms.teamName}</label>
                <Input name="teamName" defaultValue={selectedEntry.teamName} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.points}</label>
                  <Input name="points" type="number" defaultValue={selectedEntry.points} min="0" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.wins}</label>
                  <Input name="wins" type="number" defaultValue={selectedEntry.wins} min="0" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.kills}</label>
                  <Input name="kills" type="number" defaultValue={selectedEntry.kills} min="0" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.matches}</label>
                  <Input name="matchesPlayed" type="number" defaultValue={selectedEntry.matchesPlayed} min="0" required />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false);
                  setSelectedEntry(null);
                }}
              >
                {siteConfig.ui.common.close}
              </Button>
              <Button type="submit">{siteConfig.ui.common.save}</Button>
            </ModalFooter>
          </form>
        )}
      </Modal>
    </div>
  );
}
