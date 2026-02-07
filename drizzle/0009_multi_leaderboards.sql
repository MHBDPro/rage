CREATE TABLE "leaderboards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "leaderboards_slug_idx" ON "leaderboards" USING btree ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "leaderboards_main_unique" ON "leaderboards" ("is_main") WHERE "is_main" = true;
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"leaderboard_id" integer NOT NULL,
	"team_name" varchar(100) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"kills" integer DEFAULT 0 NOT NULL,
	"matches_played" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_entries_leaderboard_id_leaderboards_id_fk" FOREIGN KEY ("leaderboard_id") REFERENCES "public"."leaderboards"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX "leaderboard_entries_team_idx" ON "leaderboard_entries" USING btree ("leaderboard_id", "team_name");
--> statement-breakpoint
INSERT INTO "leaderboards" ("title", "slug", "status", "is_main", "created_at", "updated_at")
VALUES ('Main Leaderboard', 'main', 'active', true, now(), now());
--> statement-breakpoint
INSERT INTO "leaderboard_entries" ("leaderboard_id", "team_name", "points", "wins", "kills", "matches_played", "created_at", "updated_at")
SELECT lb.id, l.team_name, l.points, l.wins, l.kills, l.matches_played, l.created_at, l.updated_at
FROM "leaderboard" l
CROSS JOIN (SELECT id FROM "leaderboards" WHERE slug = 'main' LIMIT 1) lb;
--> statement-breakpoint
DROP TABLE "leaderboard";
