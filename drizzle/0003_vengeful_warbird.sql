ALTER TYPE "public"."match_stage" ADD VALUE IF NOT EXISTS 'THIRD_PLACE' BEFORE 'FINAL';--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN IF NOT EXISTS "knockout_scores" jsonb;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN IF NOT EXISTS "next_loser_match_id" text;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN IF NOT EXISTS "next_loser_slot" text;
