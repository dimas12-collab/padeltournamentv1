ALTER TYPE "public"."match_stage" ADD VALUE 'THIRD_PLACE' BEFORE 'FINAL';--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "knockout_scores" jsonb;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "next_loser_match_id" text;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "next_loser_slot" text;