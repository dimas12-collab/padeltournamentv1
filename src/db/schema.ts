import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const roleEnum = pgEnum("user_role", ["SUPER_ADMIN", "EVENT_ADMIN", "SCOREKEEPER"]);
export const eventStatusEnum = pgEnum("event_status", ["UPCOMING", "ONGOING", "FINISHED"]);
export const matchStatusEnum = pgEnum("match_status", ["SCHEDULED", "LIVE", "FINISHED", "POSTPONED", "CANCELLED"]);
export const stageEnum = pgEnum("match_stage", ["GROUP", "QUARTER_FINAL", "SEMI_FINAL", "FINAL", "OTHER"]);

/** Better Auth core model. The additional fields are the application profile. */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: roleEnum("role").notNull().default("SCOREKEEPER"),
  assignedEventId: text("assigned_event_id"),
  ...timestamps,
}, (table) => [uniqueIndex("users_email_unique").on(table.email)]);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), token: text("token").notNull(), userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), ipAddress: text("ip_address"), userAgent: text("user_agent"), ...timestamps,
}, (table) => [uniqueIndex("sessions_token_unique").on(table.token), index("sessions_user_id_idx").on(table.userId)]);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(), accountId: text("account_id").notNull(), providerId: text("provider_id").notNull(), issuer: text("issuer").notNull(), userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"), refreshToken: text("refresh_token"), idToken: text("id_token"), accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }), refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }), scope: text("scope"), password: text("password"), ...timestamps,
}, (table) => [index("accounts_user_id_idx").on(table.userId)]);

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), ...timestamps,
}, (table) => [index("verifications_identifier_idx").on(table.identifier)]);

export const events = pgTable("events", {
  id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull(), logoUrl: text("logo_url"), bannerUrl: text("banner_url"), organizer: text("organizer").notNull(), venue: text("venue").notNull(), description: text("description").notNull(), startDate: timestamp("start_date", { withTimezone: true }).notNull(), endDate: timestamp("end_date", { withTimezone: true }).notNull(), status: eventStatusEnum("status").notNull(), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps,
}, (table) => [uniqueIndex("events_slug_unique").on(table.slug)]);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(), eventId: text("event_id").notNull().references(() => events.id), name: text("name").notNull(), slug: text("slug").notNull(), scoringRule: jsonb("scoring_rule").notNull().default(sql`'{}'::jsonb`), tieBreakRule: jsonb("tie_break_rule").notNull().default(sql`'[]'::jsonb`), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps,
}, (table) => [uniqueIndex("categories_event_slug_unique").on(table.eventId, table.slug)]);

export const groups = pgTable("groups", { id: text("id").primaryKey(), categoryId: text("category_id").notNull().references(() => categories.id), name: text("name").notNull(), sortOrder: integer("sort_order").notNull().default(0), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps });
export const teams = pgTable("teams", { id: text("id").primaryKey(), eventId: text("event_id").notNull().references(() => events.id), categoryId: text("category_id").notNull().references(() => categories.id), name: text("name").notNull(), logoUrl: text("logo_url"), seedNumber: integer("seed_number"), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps });
export const players = pgTable("players", { id: text("id").primaryKey(), teamId: text("team_id").notNull().references(() => teams.id), name: text("name").notNull(), nickname: text("nickname"), photoUrl: text("photo_url"), phone: text("phone"), email: text("email"), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps });
export const groupTeams = pgTable("group_teams", { groupId: text("group_id").notNull().references(() => groups.id), teamId: text("team_id").notNull().references(() => teams.id), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [primaryKey({ columns: [table.groupId, table.teamId] })]);
export const courts = pgTable("courts", { id: text("id").primaryKey(), eventId: text("event_id").notNull().references(() => events.id), name: text("name").notNull(), sortOrder: integer("sort_order").notNull().default(0), isActive: boolean("is_active").notNull().default(true), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps });
export const matches = pgTable("matches", { id: text("id").primaryKey(), eventId: text("event_id").notNull().references(() => events.id), categoryId: text("category_id").notNull().references(() => categories.id), groupId: text("group_id").references(() => groups.id), stage: stageEnum("stage").notNull(), round: integer("round"), teamAId: text("team_a_id").references(() => teams.id), teamBId: text("team_b_id").references(() => teams.id), courtId: text("court_id").references(() => courts.id), scheduledAt: timestamp("scheduled_at", { withTimezone: true }), status: matchStatusEnum("status").notNull(), winnerId: text("winner_id").references(() => teams.id), nextMatchId: text("next_match_id"), nextMatchSlot: text("next_match_slot"), notes: text("notes"), deletedAt: timestamp("deleted_at", { withTimezone: true }), ...timestamps }, (table) => [index("matches_event_schedule_idx").on(table.eventId, table.scheduledAt), index("matches_group_status_idx").on(table.groupId, table.status)]);
export const matchSets = pgTable("match_sets", { id: text("id").primaryKey(), matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }), setNumber: integer("set_number").notNull(), teamAScore: integer("team_a_score").notNull(), teamBScore: integer("team_b_score").notNull(), ...timestamps }, (table) => [uniqueIndex("match_sets_match_number_unique").on(table.matchId, table.setNumber)]);
export const auditLogs = pgTable("audit_logs", { id: text("id").primaryKey(), userId: text("user_id").references(() => users.id), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id").notNull(), beforeData: jsonb("before_data"), afterData: jsonb("after_data"), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [index("audit_logs_entity_idx").on(table.entityType, table.entityId), index("audit_logs_created_idx").on(table.createdAt)]);

export const schema = { users, sessions, accounts, verifications, events, categories, groups, teams, players, groupTeams, courts, matches, matchSets, auditLogs };
