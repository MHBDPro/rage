import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Post } from "@/lib/db/schema";

interface NewsCardProps {
  post: Post;
  className?: string;
}

export function NewsCard({ post, className }: NewsCardProps) {
  const publishedDate = post.publishedAt || post.createdAt;

  return (
    <Link
      href={`/news/${post.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a0b14] transition duration-300",
        "hover:border-primary/40 hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.2)]",
        className
      )}
    >
      {/* Background Blog Text */}
      <div className="pointer-events-none absolute right-2 top-0 text-[6rem] font-black leading-none font-[family-name:var(--font-rajdhani)] opacity-[0.04] text-primary">
        BLOG
      </div>

      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden border-b border-white/5">
        {post.coverImage ? (
          <>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0f111a] via-[#0a0b14] to-black">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">
              {siteConfig.brand.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>{siteConfig.ui.news.readMore}</span>
          <span className="text-primary/80">{post.author}</span>
        </div>

        <h3 className="text-lg font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wide text-white transition-colors group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between text-xs text-white/40">
          <span className="uppercase tracking-[0.2em]">
            {siteConfig.ui.news.authorLabel}
          </span>
          <span>
            {new Date(publishedDate).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary/0 transition-all duration-300 group-hover:border-primary/60" />
      <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary/0 transition-all duration-300 group-hover:border-primary/60" />
    </Link>
  );
}
