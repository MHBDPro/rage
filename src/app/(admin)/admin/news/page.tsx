"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Newspaper,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  getPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
} from "@/lib/actions/blog";
import type { Post } from "@/lib/db/schema";
import { TacticalEditor } from "@/components/news/tactical-editor";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { siteConfig } from "@/config/site";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}

const statusBadge = {
  published: {
    variant: "success" as const,
    label: siteConfig.ui.news.statusPublished,
  },
  draft: {
    variant: "warning" as const,
    label: siteConfig.ui.news.statusDraft,
  },
};

export default function NewsAdminPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [coverImage, setCoverImage] = React.useState("");
  const [content, setContent] = React.useState("");
  const searchParams = useSearchParams();

  const openAddModal = React.useCallback(() => {
    setSelectedPost(null);
    setCoverImage("");
    setContent("");
    setAddModalOpen(true);
  }, []);

  const stats = React.useMemo(() => {
    const published = posts.filter((post) => post.published).length;
    return {
      total: posts.length,
      published,
      draft: posts.length - published,
    };
  }, [posts]);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getPostsAdmin();
    setPosts(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      openAddModal();
    }
  }, [openAddModal, searchParams]);

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setCoverImage(post.coverImage || "");
    setContent(post.content);
    setEditModalOpen(true);
  };

  const handleAdd = async (formData: FormData) => {
    formData.set("coverImage", coverImage);
    formData.set("content", content);

    const result = await createPost(null, formData);
    if (result.success) {
      toast.success(result.message);
      setAddModalOpen(false);
      setCoverImage("");
      setContent("");
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedPost) return;

    formData.set("coverImage", coverImage || selectedPost.coverImage || "");
    formData.set("content", content);

    const result = await updatePost(selectedPost.id, null, formData);
    if (result.success) {
      toast.success(result.message);
      setEditModalOpen(false);
      setSelectedPost(null);
      setCoverImage("");
      setContent("");
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu intel icerigini silmek istediginizden emin misiniz?")) {
      return;
    }

    const result = await deletePost(id);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    const result = await togglePostPublish(post.id, !post.published);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
              Blog Yonetimi
            </h1>
            <p className="text-muted-foreground">
              Blog haberlerini yonetin ve yayina alin
            </p>
          </div>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Blog
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Toplam", value: stats.total },
            { label: "Yayinda", value: stats.published },
            { label: "Taslak", value: stats.draft },
          ].map((stat) => (
            <Card key={stat.label} variant="glass" className="p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                {stat.label}
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Blog Listesi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 skeleton rounded-lg" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Henuz intel icerigi yok
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Baslik
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Durum
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Yazar
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                        Tarih
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                        Islemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-border/50">
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {post.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              /{post.slug}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              post.published
                                ? statusBadge.published.variant
                                : statusBadge.draft.variant
                            }
                          >
                            {post.published
                              ? statusBadge.published.label
                              : statusBadge.draft.label}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {post.author}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {new Date(
                            post.publishedAt || post.createdAt
                          ).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublish(post)}
                            >
                              {post.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(post)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        className="max-w-5xl max-h-[90vh] overflow-hidden"
      >
        <ModalHeader>
          <ModalTitle>Yeni Blog</ModalTitle>
          <ModalDescription>Blog içeriği oluşturun</ModalDescription>
        </ModalHeader>
        <form action={handleAdd}>
          <ModalBody className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Başlık</label>
                  <Input name="title" placeholder="Blog başlığı" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Slug (opsiyonel)</label>
                  <Input name="slug" placeholder="intel-baslik" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Yazar</label>
                  <Input name="author" placeholder="Yazar adı" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Özet</label>
                  <textarea
                    name="excerpt"
                    rows={4}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#0b0d17] px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                    placeholder="Kısa özet"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Kapak Görseli</label>
                  {coverImage ? (
                    <div className="relative mb-2 h-36 w-full overflow-hidden rounded-lg border border-border">
                      <Image
                        src={coverImage}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="absolute right-2 top-2 rounded bg-destructive p-1 text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <UploadButton<OurFileRouter, "newsCover">
                      endpoint="newsCover"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          setCoverImage(res[0].url);
                          toast.success("Kapak görseli yüklendi");
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(`Yükleme hatası: ${error.message}`);
                      }}
                      appearance={{
                        button:
                          "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium",
                        allowedContent: "text-muted-foreground text-xs",
                      }}
                    />
                  )}
                  <Input type="hidden" name="coverImage" value={coverImage} />
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Upload className="h-4 w-4 text-primary" />
                    Blog editörü Markdown destekler. Başlıklar için `##`, linkler için `[metin](url)`
                    kullanın.
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" value="true" />
                  Yayında
                </label>
              </div>
            </div>

            <TacticalEditor
              value={content}
              onChange={setContent}
              placeholder="Blog içeriğinizi Markdown ile yazın..."
            />
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
            >
              İptal
            </Button>
            <SubmitButton>Oluştur</SubmitButton>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        className="max-w-5xl max-h-[90vh] overflow-hidden"
      >
        <ModalHeader>
          <ModalTitle>Blog Düzenle</ModalTitle>
          <ModalDescription>Blog içeriğini güncelleyin</ModalDescription>
        </ModalHeader>
        {selectedPost && (
          <form action={handleEdit}>
            <ModalBody className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Başlık</label>
                    <Input
                      name="title"
                      defaultValue={selectedPost.title}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Slug (opsiyonel)</label>
                    <Input name="slug" defaultValue={selectedPost.slug} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Yazar</label>
                    <Input
                      name="author"
                      defaultValue={selectedPost.author}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Özet</label>
                    <textarea
                      name="excerpt"
                      rows={4}
                      required
                      className="w-full rounded-lg border border-white/10 bg-[#0b0d17] px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                      defaultValue={selectedPost.excerpt}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Kapak Görseli</label>
                    {coverImage ? (
                      <div className="relative mb-2 h-36 w-full overflow-hidden rounded-lg border border-border">
                        <Image
                          src={coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setCoverImage("")}
                          className="absolute right-2 top-2 rounded bg-destructive p-1 text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <UploadButton<OurFileRouter, "newsCover">
                        endpoint="newsCover"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]?.url) {
                            setCoverImage(res[0].url);
                            toast.success("Kapak görseli yüklendi");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Yükleme hatası: ${error.message}`);
                        }}
                        appearance={{
                          button:
                            "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium",
                          allowedContent: "text-muted-foreground text-xs",
                        }}
                      />
                    )}
                    <Input type="hidden" name="coverImage" value={coverImage} />
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <Upload className="h-4 w-4 text-primary" />
                      Blog editörü Markdown destekler. Başlıklar için `##`, linkler için `[metin](url)`
                      kullanın.
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={selectedPost.published}
                    />
                    Yayında
                  </label>
                </div>
              </div>

              <TacticalEditor
                value={content}
                onChange={setContent}
                placeholder="Blog içeriğinizi Markdown ile yazın..."
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                İptal
              </Button>
              <SubmitButton>Kaydet</SubmitButton>
            </ModalFooter>
          </form>
        )}
      </Modal>
    </div>
  );
}
