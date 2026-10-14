UPDATE "events" SET "logo_url" = NULL WHERE "logo_url" LIKE 'data:image/%';--> statement-breakpoint
UPDATE "events" SET "banner_url" = NULL WHERE "banner_url" LIKE 'data:image/%';--> statement-breakpoint
UPDATE "events"
SET "sponsor_images" = COALESCE((
	SELECT jsonb_agg(image)
	FROM jsonb_array_elements("events"."sponsor_images") AS image
	WHERE jsonb_typeof(image) = 'string'
		AND image #>> '{}' NOT LIKE 'data:image/%'
), '[]'::jsonb)
WHERE EXISTS (
	SELECT 1
	FROM jsonb_array_elements("events"."sponsor_images") AS image
	WHERE jsonb_typeof(image) = 'string'
		AND image #>> '{}' LIKE 'data:image/%'
);--> statement-breakpoint
UPDATE "teams" SET "logo_url" = NULL WHERE "logo_url" LIKE 'data:image/%';--> statement-breakpoint
UPDATE "players" SET "photo_url" = NULL WHERE "photo_url" LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "before_data" = "before_data" - 'logo' WHERE "before_data"->>'logo' LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "before_data" = "before_data" - 'banner' WHERE "before_data"->>'banner' LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "before_data" = "before_data" - 'photo' WHERE "before_data"->>'photo' LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "before_data" = "before_data" - 'sponsors' WHERE "before_data"->'sponsors' IS NOT NULL AND ("before_data"->'sponsors')::text LIKE '%data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "after_data" = "after_data" - 'logo' WHERE "after_data"->>'logo' LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "after_data" = "after_data" - 'banner' WHERE "after_data"->>'banner' LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "after_data" = "after_data" - 'photo' WHERE "after_data"->>'photo' LIKE 'data:image/%';--> statement-breakpoint
UPDATE "audit_logs" SET "after_data" = "after_data" - 'sponsors' WHERE "after_data"->'sponsors' IS NOT NULL AND ("after_data"->'sponsors')::text LIKE '%data:image/%';
