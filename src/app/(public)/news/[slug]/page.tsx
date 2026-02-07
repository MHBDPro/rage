import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GoogleAdUnit } from "@/components/ads/google-ad-unit";
import { Card } from "@/components/ui/card";
import { getPublishedPostBySlug } from "@/lib/actions/blog";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: siteConfig.seo.defaultTitle,
    };
  }

  return {
    title: `${post.title} | ${siteConfig.brand.fullName}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt || post.createdAt;

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/news"
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 transition hover:text-primary"
        >
          <span>Blog</span>
          <span className="h-px w-6 bg-primary/50" />
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-black font-[family-name:var(--font-rajdhani)] uppercase tracking-wide text-white md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-primary">{post.author}</span>
            <span className="text-white/30">{"//"}</span>
            <span>
              {new Date(publishedDate).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {post.coverImage && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-transparent to-transparent" />
          </div>
        )}

        <Card variant="tactical" className="mb-10">
          <p className="text-sm text-white/80">{post.excerpt}</p>
        </Card>

        <div className="mb-10">
          <GoogleAdUnit />
        </div>

        <article className="prose prose-invert prose-cyber max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <Card variant="glass" className="mt-10">
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <span className="text-xs uppercase tracking-[0.3em] text-primary/70">
              Blog Nexus
            </span>
            <p>
              Daha fazla guncelleme icin {"Blog Merkezi'ni"} takip edin ve yeni scrim duyurularini kacirmayin.
            </p>
          </div>
        </Card>

        <div className="mt-10">
          <GoogleAdUnit />
        </div>
      </div>
    </div>
  );
}
