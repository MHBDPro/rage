"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Crown, Pencil, Plus, Trash2, Trophy, Users } from "lucide-react";
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
  createLeaderboard,
  deleteLeaderboard,
  getLeaderboardsAdmin,
  setMainLeaderboard,
  updateLeaderboard,
} from "@/lib/actions/admin";
import type { Leaderboard } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

interface LeaderboardSummary extends Leaderboard {
  entryCount: number;
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

export default function LeaderboardAdminPage() {
  const [leaderboards, setLeaderboards] = React.useState<LeaderboardSummary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedLeaderboard, setSelectedLeaderboard] = React.useState<LeaderboardSummary | null>(null);
  const searchParams = useSearchParams();

  const loadLeaderboards = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getLeaderboardsAdmin();
    setLeaderboards(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadLeaderboards();
  }, [loadLeaderboards]);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setCreateOpen(true);
    }
  }, [searchParams]);

  const handleCreate = async (formData: FormData) => {
    const result = await createLeaderboard(null, formData);
    if (result.success) {
      toast.success(result.message);
      setCreateOpen(false);
      loadLeaderboards();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedLeaderboard) return;
    const result = await updateLeaderboard(selectedLeaderboard.id, null, formData);
    if (result.success) {
      toast.success(result.message);
      setEditOpen(false);
      setSelectedLeaderboard(null);
      loadLeaderboards();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (leaderboardId: number) => {
    const result = await deleteLeaderboard(leaderboardId);
    if (result.success) {
      toast.success(result.message);
      loadLeaderboards();
    } else {
      toast.error(result.message);
    }
  };

  const handleSetMain = async (leaderboardId: number) => {
    const result = await setMainLeaderboard(leaderboardId);
    if (result.success) {
      toast.success(result.message);
      loadLeaderboards();
    } else {
      toast.error(result.message);
    }
  };

  const openEditModal = (leaderboard: LeaderboardSummary) => {
    setSelectedLeaderboard(leaderboard);
    setEditOpen(true);
  };

  const activeCount = leaderboards.filter((board) => board.status === "active").length;
  const archivedCount = leaderboards.filter((board) => board.status === "archived").length;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              {siteConfig.ui.leaderboard.adminTitle}
            </h1>
            <p className="text-muted-foreground">
              {siteConfig.ui.leaderboard.adminSubtitle}
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {siteConfig.ui.leaderboard.createLabel}
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card variant="default" hoverEffect>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{siteConfig.ui.leaderboard.activeLabel}</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-primary">
                  {activeCount}
                </p>
              </div>
              <Trophy className="h-6 w-6 text-primary/60" />
            </CardContent>
          </Card>
          <Card variant="default" hoverEffect>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{siteConfig.ui.leaderboard.archivedLabel}</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-muted-foreground">
                  {archivedCount}
                </p>
              </div>
              <Users className="h-6 w-6 text-muted-foreground/70" />
            </CardContent>
          </Card>
          <Card variant="default" hoverEffect>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{siteConfig.ui.leaderboard.entriesLabel}</p>
                <p className="text-2xl font-bold font-[family-name:var(--font-rajdhani)] text-primary">
                  {leaderboards.reduce((sum, board) => sum + board.entryCount, 0)}
                </p>
              </div>
              <Crown className="h-6 w-6 text-primary/60" />
            </CardContent>
          </Card>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {siteConfig.ui.leaderboard.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 skeleton rounded-lg" />
                ))}
              </div>
            ) : leaderboards.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                {siteConfig.ui.leaderboard.emptyBoards}
              </p>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {leaderboards.map((board) => (
                  <motion.div key={board.id} variants={itemVariants}>
                    <Card variant="tactical" className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold font-[family-name:var(--font-rajdhani)] uppercase text-foreground">
                              {board.title}
                            </h3>
                            {board.isMain && (
                              <Badge className="border-primary/40 bg-primary/10 text-primary">
                                {siteConfig.ui.leaderboard.mainLabel}
                              </Badge>
                            )}
                            <Badge className={statusStyles[board.status]}>
                              {board.status === "active"
                                ? siteConfig.ui.leaderboard.activeLabel
                                : siteConfig.ui.leaderboard.archivedLabel}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            /leaderboard/{board.slug}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {board.entryCount} {siteConfig.ui.leaderboard.entriesLabel}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/admin/leaderboard/${board.id}`}>
                            <Button variant="outline" size="sm">
                              {siteConfig.ui.leaderboard.manageEntriesLabel}
                            </Button>
                          </Link>
                          {!board.isMain && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSetMain(board.id)}
                            >
                              <Crown className="mr-2 h-4 w-4" />
                              {siteConfig.ui.leaderboard.setMainLabel}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => openEditModal(board)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(board.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <ModalHeader>
          <ModalTitle>{siteConfig.ui.leaderboard.createLabel}</ModalTitle>
          <ModalDescription>
            {siteConfig.ui.leaderboard.adminSubtitle}
          </ModalDescription>
        </ModalHeader>
        <form action={handleCreate}>
          <ModalBody className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.title}</label>
              <Input name="title" placeholder={siteConfig.ui.leaderboard.title} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.slugLabel}</label>
              <Input name="slug" placeholder={siteConfig.ui.leaderboard.slugPlaceholder} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.statusLabel}</label>
              <select
                name="status"
                defaultValue="active"
                className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="active">{siteConfig.ui.leaderboard.activeLabel}</option>
                <option value="archived">{siteConfig.ui.leaderboard.archivedLabel}</option>
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
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
          setSelectedLeaderboard(null);
        }}
      >
        <ModalHeader>
          <ModalTitle>{siteConfig.ui.common.edit}</ModalTitle>
          <ModalDescription>{siteConfig.ui.leaderboard.adminSubtitle}</ModalDescription>
        </ModalHeader>
        {selectedLeaderboard && (
          <form action={handleEdit}>
            <ModalBody className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.title}</label>
                <Input name="title" defaultValue={selectedLeaderboard.title} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.slugLabel}</label>
                <Input name="slug" defaultValue={selectedLeaderboard.slug} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{siteConfig.ui.leaderboard.statusLabel}</label>
                <select
                  name="status"
                  defaultValue={selectedLeaderboard.status}
                  className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="active">{siteConfig.ui.leaderboard.activeLabel}</option>
                  <option value="archived">{siteConfig.ui.leaderboard.archivedLabel}</option>
                </select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false);
                  setSelectedLeaderboard(null);
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
