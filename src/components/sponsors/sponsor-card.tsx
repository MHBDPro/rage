"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Twitch,
  MessageCircle,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Sponsor, SponsorSocialLinks } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface SponsorCardProps {
  sponsor: Sponsor;
  index?: number;
}

const tierConfig = {
  gold: {
    badge: "gold" as const,
    border: "border-yellow-500/40 hover:border-yellow-500/60",
    glow: "shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:shadow-[0_0_40px_rgba(234,179,8,0.25)]",
    bg: "bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-transparent",
    icon: Crown,
    label: "Altın Sponsor",
    iconColor: "text-yellow-500",
  },
  silver: {
    badge: "secondary" as const,
    border: "border-gray-400/40 hover:border-gray-400/60",
    glow: "shadow-[0_0_20px_rgba(156,163,175,0.1)] hover:shadow-[0_0_30px_rgba(156,163,175,0.2)]",
    bg: "bg-gradient-to-br from-gray-400/5 via-gray-500/5 to-transparent",
    icon: Medal,
    label: "Gümüş Sponsor",
    iconColor: "text-gray-400",
  },
  bronze: {
    badge: "warning" as const,
    border: "border-amber-700/40 hover:border-amber-700/60",
    glow: "shadow-[0_0_15px_rgba(180,83,9,0.1)] hover:shadow-[0_0_25px_rgba(180,83,9,0.15)]",
    bg: "bg-gradient-to-br from-amber-700/5 via-orange-700/5 to-transparent",
    icon: Award,
    label: "Bronz Sponsor",
    iconColor: "text-amber-600",
  },
};

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  twitch: Twitch,
  discord: MessageCircle,
};

export function SponsorCard({ sponsor, index = 0 }: SponsorCardProps) {
  const tier = tierConfig[sponsor.tier as keyof typeof tierConfig] || tierConfig.bronze;
  const socialLinks = (sponsor.socialLinks as SponsorSocialLinks) || {};
  const TierIcon = tier.icon;

  const activeSocialLinks = Object.entries(socialLinks).filter(
    ([, url]) => url && url.trim() !== ""
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card
        variant="glass"
        hoverEffect
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          tier.border,
          tier.glow,
          tier.bg
        )}
      >
        {/* Tier Badge */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5">
          <Badge variant={tier.badge} className="flex items-center gap-1">
            <TierIcon className={cn("h-3 w-3", tier.iconColor)} />
            {tier.label}
          </Badge>
        </div>

        {/* Background Glow Effect */}
        <div
          className={cn(
            "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40",
            sponsor.tier === "gold" && "bg-yellow-500",
            sponsor.tier === "silver" && "bg-gray-400",
            sponsor.tier === "bronze" && "bg-amber-600"
          )}
        />

        {/* Logo Container */}
        <div className="relative mb-6 flex items-center justify-center pt-2">
          <div className="relative h-24 w-full max-w-[180px] transition-transform duration-300 group-hover:scale-105">
            <Image
              src={sponsor.logoUrl}
              alt={sponsor.name}
              fill
              className="object-contain drop-shadow-lg"
              sizes="180px"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-3 text-center">
          <h3 className="text-xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wide text-foreground">
            {sponsor.name}
          </h3>

          {sponsor.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {sponsor.description}
            </p>
          )}
        </div>

        {/* Social Links & Website */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {activeSocialLinks.map(([platform, url]) => {
            const Icon = socialIcons[platform as keyof typeof socialIcons];
            if (!Icon || !url) return null;

            return (
              <SocialButton key={platform} href={url} icon={<Icon className="h-4 w-4" />} />
            );
          })}

          {sponsor.websiteUrl && (
            <SocialButton
              href={sponsor.websiteUrl}
              icon={<ExternalLink className="h-4 w-4" />}
              primary
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  primary?: boolean;
}

function SocialButton({ href, icon, primary = false }: SocialButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200",
        primary
          ? "border-primary/50 bg-primary/10 text-primary hover:border-primary hover:bg-primary/20"
          : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
      )}
    >
      {icon}
    </motion.a>
  );
}

export default SponsorCard;
