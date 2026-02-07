import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { GoogleAdUnit } from "@/components/ads/google-ad-unit";
import { NewsCard } from "@/components/news/news-card";
import { getPublishedPosts } from "@/lib/actions/blog";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.ui.news.title} | ${siteConfig.brand.fullName}`,
  description: siteConfig.ui.news.subtitle,
};

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  const [titleLead, ...titleRest] = siteConfig.ui.news.title.split(" ");

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider md:text-5xl">
            <span className="gradient-text">{titleLead}</span>{" "}
            <span className="text-foreground">{titleRest.join(" ")}</span>
          </h1>
          <p className="text-muted-foreground">
            {siteConfig.ui.news.subtitle}
          </p>
        </div>

        {posts.length === 0 ? (
          <Card variant="glass" className="py-16 text-center text-muted-foreground">
            {siteConfig.ui.news.empty}
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-16">
          <GoogleAdUnit />
        </div>
      </div>
    </div>
  );
}
