CREATE TABLE "daily_scrim_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug_prefix" varchar(50) DEFAULT 'daily' NOT NULL,
	"start_time" varchar(5) DEFAULT '00:00' NOT NULL,
	"mode" varchar(10) NOT NULL,
	"map_name" text NOT NULL,
	"announcement" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
