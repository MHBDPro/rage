CREATE TABLE "scrim_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"mode" varchar(10) NOT NULL,
	"map_name" text NOT NULL,
	"status" varchar(20) DEFAULT 'closed' NOT NULL,
	"champion_team" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "scrim_sessions_slug_idx" ON "scrim_sessions" ("slug");

ALTER TABLE "slots" ADD COLUMN "session_id" integer;
ALTER TABLE "slots" ADD COLUMN "is_locked" boolean DEFAULT false NOT NULL;
ALTER TABLE "slots" ALTER COLUMN "team_name" DROP NOT NULL;
ALTER TABLE "slots" ALTER COLUMN "instagram" DROP NOT NULL;
ALTER TABLE "slots" ALTER COLUMN "ip_address" DROP NOT NULL;

WITH days AS (
	SELECT DISTINCT created_at::date AS day
	FROM "slots"
),
sessions AS (
	INSERT INTO "scrim_sessions" ("slug", "title", "start_time", "mode", "map_name", "status", "created_at", "updated_at")
	SELECT
		'legacy-' || to_char(day, 'YYYYMMDD'),
		'Legacy Scrim ' || to_char(day, 'YYYY-MM-DD'),
		day::timestamp,
		'TPP',
		'Unknown',
		'completed',
		now(),
		now()
	FROM days
	RETURNING "id", "start_time"
)
UPDATE "slots" s
SET "session_id" = sessions."id"
FROM sessions
WHERE s."created_at"::date = sessions."start_time"::date;

DELETE FROM "slots"
WHERE "id" IN (
	SELECT "id"
	FROM (
		SELECT
			"id",
			row_number() OVER (
				PARTITION BY "session_id", "slot_number"
				ORDER BY "created_at" ASC, "id" ASC
			) AS rn
		FROM "slots"
	) dedup
	WHERE dedup.rn > 1
);

ALTER TABLE "slots" ALTER COLUMN "session_id" SET NOT NULL;
ALTER TABLE "slots" ADD CONSTRAINT "slots_session_id_scrim_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "scrim_sessions" ("id") ON DELETE cascade;

DROP INDEX IF EXISTS "slots_slot_number_date_idx";
CREATE UNIQUE INDEX "slots_session_slot_idx" ON "slots" ("session_id", "slot_number");

ALTER TABLE "settings" DROP COLUMN IF EXISTS "scrim_open_time";
