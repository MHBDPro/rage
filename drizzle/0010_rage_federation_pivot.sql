-- Rage Federation pivot: schema extensions + league seed

ALTER TABLE "scrim_sessions"
ADD COLUMN IF NOT EXISTS "max_slots" integer DEFAULT 32 NOT NULL;

ALTER TABLE "scrim_sessions"
ADD COLUMN IF NOT EXISTS "tournament_type" varchar(20) DEFAULT 'custom' NOT NULL;

ALTER TABLE "scrim_sessions"
ADD COLUMN IF NOT EXISTS "is_fast_cup" boolean DEFAULT false NOT NULL;

ALTER TABLE "daily_scrim_templates"
ADD COLUMN IF NOT EXISTS "max_slots" integer DEFAULT 32 NOT NULL;

ALTER TABLE "daily_scrim_templates"
ADD COLUMN IF NOT EXISTS "tournament_type" varchar(20) DEFAULT 'fast_cup' NOT NULL;

ALTER TABLE "daily_scrim_templates"
ADD COLUMN IF NOT EXISTS "is_fast_cup" boolean DEFAULT true NOT NULL;

ALTER TABLE "slots"
ADD COLUMN IF NOT EXISTS "player_name" varchar(100);

ALTER TABLE "slots"
ADD COLUMN IF NOT EXISTS "psn_id" varchar(100);

ALTER TABLE "slots"
ADD COLUMN IF NOT EXISTS "team_selection" varchar(100);

-- Normalize legacy PUBG mode values into eFootball defaults.
UPDATE "scrim_sessions"
SET "mode" = 'BO1'
WHERE "mode" IN ('TPP', 'FPP');

UPDATE "daily_scrim_templates"
SET "mode" = 'BO1'
WHERE "mode" IN ('TPP', 'FPP');

-- Backfill solo fields from legacy team-based data.
UPDATE "slots"
SET
  "player_name" = COALESCE("player_name", NULLIF("team_name", ''), 'Bilinmeyen Oyuncu'),
  "psn_id" = COALESCE("psn_id", NULLIF("team_name", ''), CONCAT('legacy-', "id")),
  "team_selection" = COALESCE("team_selection", NULLIF("team_name", ''), 'Belirtilmedi')
WHERE "player_name" IS NULL OR "psn_id" IS NULL OR "team_selection" IS NULL;

-- Seed league boards required by Rage Federation.
INSERT INTO "leaderboards" ("title", "slug", "status", "is_main", "created_at", "updated_at")
SELECT 'UCL', 'ucl', 'active', false, now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM "leaderboards" WHERE "slug" = 'ucl'
);

INSERT INTO "leaderboards" ("title", "slug", "status", "is_main", "created_at", "updated_at")
SELECT 'UEL', 'uel', 'active', false, now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM "leaderboards" WHERE "slug" = 'uel'
);

INSERT INTO "leaderboards" ("title", "slug", "status", "is_main", "created_at", "updated_at")
SELECT 'UKL', 'ukl', 'active', false, now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM "leaderboards" WHERE "slug" = 'ukl'
);

UPDATE "leaderboards"
SET "is_main" = false,
    "updated_at" = now()
WHERE "is_main" = true;

UPDATE "leaderboards"
SET "is_main" = true,
    "status" = 'active',
    "updated_at" = now()
WHERE "slug" = 'ucl';
