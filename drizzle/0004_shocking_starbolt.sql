ALTER TABLE "events" ADD COLUMN "sponsor_background" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "sponsor_images" jsonb DEFAULT '[]'::jsonb NOT NULL;