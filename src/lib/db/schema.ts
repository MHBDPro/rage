import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  varchar,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

// Re-export types from rules-types (safe for client components)
export {
  DEFAULT_RULES_CONFIG,
  type RuleCard,
  type PointSystemItem,
  type RulesConfig,
} from "./rules-types";

import type { RuleCard, PointSystemItem } from "./rules-types";

export type ScrimStatus = "active" | "closed" | "completed";
export type ScrimMode = "BO1" | "BO3";
export type TournamentType = "ucl" | "uel" | "ukl" | "fast_cup" | "custom";
export type LeaderboardStatus = "active" | "archived";

// Settings table (singleton for app configuration)
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  isMaintenance: boolean("is_maintenance").notNull().default(false),
  announcement: text("announcement"),
  // Rules & Point System JSON columns
  ruleCards: jsonb("rule_cards").$type<RuleCard[]>(),
  dos: jsonb("dos").$type<string[]>(),
  donts: jsonb("donts").$type<string[]>(),
  pointSystem: jsonb("point_system").$type<PointSystemItem[]>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Scrim sessions table (multiple sessions)
export const scrimSessions = pgTable(
  "scrim_sessions",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: text("title").notNull(),
    startTime: timestamp("start_time").notNull(),
    mode: varchar("mode", { length: 10 }).$type<ScrimMode>().notNull(),
    mapName: text("map_name").notNull(),
    maxSlots: integer("max_slots").notNull().default(32),
    tournamentType: varchar("tournament_type", { length: 20 })
      .$type<TournamentType>()
      .notNull()
      .default("custom"),
    isFastCup: boolean("is_fast_cup").notNull().default(false),
    status: varchar("status", { length: 20 })
      .$type<ScrimStatus>()
      .notNull()
      .default("closed"),
    championTeam: text("champion_team"),
    announcement: text("announcement"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("scrim_sessions_slug_idx").on(table.slug)]
);

// Daily scrim templates (multiple sessions per day)
export const dailyScrimTemplates = pgTable("daily_scrim_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  slugSuffix: varchar("slug_suffix", { length: 50 }).notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  mode: varchar("mode", { length: 10 }).$type<ScrimMode>().notNull(),
  mapName: text("map_name").notNull(),
  maxSlots: integer("max_slots").notNull().default(32),
  tournamentType: varchar("tournament_type", { length: 20 })
    .$type<TournamentType>()
    .notNull()
    .default("fast_cup"),
  isFastCup: boolean("is_fast_cup").notNull().default(true),
  announcement: text("announcement"),
  isEnabled: boolean("is_enabled").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Slots table (dynamic slot count per session)
export const slots = pgTable(
  "slots",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => scrimSessions.id, { onDelete: "cascade" }),
    slotNumber: integer("slot_number").notNull(),
    playerName: varchar("player_name", { length: 100 }),
    psnId: varchar("psn_id", { length: 100 }),
    teamSelection: varchar("team_selection", { length: 100 }),
    teamName: varchar("team_name", { length: 100 }),
    instagram: varchar("instagram", { length: 100 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    playerNames: text("player_names").array(),
    isLocked: boolean("is_locked").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("slots_session_slot_idx").on(table.sessionId, table.slotNumber)]
);

// Leaderboards table (multi-leaderboard)
export const leaderboards = pgTable(
  "leaderboards",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    status: varchar("status", { length: 20 })
      .$type<LeaderboardStatus>()
      .notNull()
      .default("active"),
    isMain: boolean("is_main").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("leaderboards_slug_idx").on(table.slug)]
);

// Leaderboard entries table (team stats)
export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: serial("id").primaryKey(),
    leaderboardId: integer("leaderboard_id")
      .notNull()
      .references(() => leaderboards.id, { onDelete: "cascade" }),
    teamName: varchar("team_name", { length: 100 }).notNull(),
    points: integer("points").notNull().default(0),
    wins: integer("wins").notNull().default(0),
    kills: integer("kills").notNull().default(0),
    matchesPlayed: integer("matches_played").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("leaderboard_entries_team_idx").on(
      table.leaderboardId,
      table.teamName
    ),
  ]
);

// Admins table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sponsor social links type
export type SponsorSocialLinks = {
  instagram?: string;
  twitter?: string;
  discord?: string;
  youtube?: string;
  twitch?: string;
};

// Sponsors table
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: text("logo_url").notNull(),
  description: text("description"),
  websiteUrl: text("website_url"),
  tier: varchar("tier", { length: 20 }).notNull().default("bronze"), // gold, silver, bronze
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  socialLinks: jsonb("social_links").$type<SponsorSocialLinks>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts table (Blog/News)
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    published: boolean("published").notNull().default(false),
    author: varchar("author", { length: 100 }).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("posts_slug_idx").on(table.slug)]
);

// Type exports for use in application
export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

export type ScrimSession = typeof scrimSessions.$inferSelect;
export type NewScrimSession = typeof scrimSessions.$inferInsert;
export type DailyScrimTemplate = typeof dailyScrimTemplates.$inferSelect;
export type NewDailyScrimTemplate = typeof dailyScrimTemplates.$inferInsert;

export type Slot = typeof slots.$inferSelect;
export type NewSlot = typeof slots.$inferInsert;

export type Leaderboard = typeof leaderboards.$inferSelect;
export type NewLeaderboard = typeof leaderboards.$inferInsert;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboardEntries.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
