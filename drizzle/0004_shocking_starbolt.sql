ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "sponsor_background" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "sponsor_images" jsonb DEFAULT '[]'::jsonb NOT NULL;
