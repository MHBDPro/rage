CREATE TABLE "daily_scrim_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"slug_suffix" varchar(50) NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"mode" varchar(10) NOT NULL,
	"map_name" text NOT NULL,
	"announcement" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "daily_scrim_templates" ("name", "title", "slug_suffix", "start_time", "mode", "map_name", "announcement", "is_enabled", "updated_at")
SELECT
  'daily',
  COALESCE("title", 'Günlük Scrim'),
  COALESCE("slug_prefix", 'daily'),
  COALESCE("start_time", '00:00'),
  "mode",
  "map_name",
  "announcement",
  COALESCE("is_enabled", true),
  COALESCE("updated_at", now())
FROM "daily_scrim_template";

DROP TABLE "daily_scrim_template";
