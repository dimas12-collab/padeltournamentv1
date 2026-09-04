import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, categories, courts, events, groups, groupTeams, matchSets, matches, players, teams, users } from "@/db/schema";
import { descendants, updateScore } from "@/lib/engine";
import type { Data, Entity, Match, MatchSet, RecordItem, Role, Rules } from "@/lib/types";

type DbUser = typeof users.$inferSelect;
const iso = (value: Date | null | undefined) => value?.toISOString();
const nullable = (value?: string) => value || null;

export async function readTournamentData(includePrivate = false): Promise<Data> {
  const [eventRows, categoryRows, groupRows, teamRows, playerRows, courtRows, matchRows, setRows, membershipRows, userRows, auditRows] = await Promise.all([
    db.select().from(events), db.select().from(categories), db.select().from(groups), db.select().from(teams), db.select().from(players), db.select().from(courts), db.select().from(matches), db.select().from(matchSets), db.select().from(groupTeams), includePrivate ? db.select().from(users) : Promise.resolve([]), includePrivate ? db.select().from(auditLogs) : Promise.resolve([]),
  ]);
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
  const teamById = new Map(teamRows.map((row) => [row.id, row]));
  const groupsByTeam = new Map(membershipRows.map((row) => [row.teamId, row.groupId]));
  const setsByMatch = new Map<string, Array<MatchSet & { setNumber: number }>>();
  for (const row of setRows) setsByMatch.set(row.matchId, [...(setsByMatch.get(row.matchId) ?? []), { a: row.teamAScore, b: row.teamBScore, setNumber: row.setNumber }]);
  const nameById = new Map<string, string>([...eventRows, ...categoryRows, ...groupRows, ...teamRows, ...playerRows, ...courtRows].map((row) => [row.id, row.name]));
  return {
    events: eventRows.map((row) => ({ id: row.id, name: row.name, slug: row.slug, organizer: row.organizer, venue: row.venue, description: row.description, startDate: iso(row.startDate)!, endDate: iso(row.endDate)!, status: row.status, logo: row.logoUrl ?? undefined, banner: row.bannerUrl ?? undefined, deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    categories: categoryRows.map((row) => ({ id: row.id, name: row.name, eventId: row.eventId, rules: row.scoringRule as Rules, deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    groups: groupRows.map((row) => ({ id: row.id, name: row.name, categoryId: row.categoryId, eventId: categoryById.get(row.categoryId)?.eventId ?? "", deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    teams: teamRows.map((row) => ({ id: row.id, name: row.name, eventId: row.eventId, categoryId: row.categoryId, groupId: groupsByTeam.get(row.id), seed: row.seedNumber ?? undefined, logo: row.logoUrl ?? undefined, deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    players: playerRows.map((row) => ({ id: row.id, name: row.name, eventId: teamById.get(row.teamId)?.eventId ?? "", teamId: row.teamId, nickname: row.nickname ?? undefined, phone: includePrivate ? row.phone ?? undefined : undefined, email: includePrivate ? row.email ?? undefined : undefined, photo: row.photoUrl ?? undefined, deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    courts: courtRows.map((row) => ({ id: row.id, name: row.name, eventId: row.eventId, active: row.isActive, sortOrder: row.sortOrder, deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    matches: matchRows.map((row) => ({ id: row.id, name: `${teamById.get(row.teamAId ?? "")?.name ?? row.stage.replaceAll("_", " ")} vs ${teamById.get(row.teamBId ?? "")?.name ?? "TBD"}`, eventId: row.eventId, categoryId: row.categoryId, groupId: row.groupId ?? undefined, stage: row.stage, teamAId: row.teamAId ?? "", teamBId: row.teamBId ?? "", courtId: row.courtId ?? undefined, scheduledAt: iso(row.scheduledAt), status: row.status, sets: (setsByMatch.get(row.id) ?? []).sort((a, b) => a.setNumber - b.setNumber).map(({ a, b }) => ({ a, b })), winnerId: row.winnerId ?? undefined, notes: row.notes ?? undefined, nextMatchId: row.nextMatchId ?? undefined, nextSlot: row.nextMatchSlot === "A" || row.nextMatchSlot === "B" ? row.nextMatchSlot : undefined, deletedAt: iso(row.deletedAt), createdAt: iso(row.createdAt) })),
    users: userRows.map((row) => ({ id: row.id, name: row.name, email: row.email, role: row.role as Role, eventId: row.assignedEventId ?? "", active: true, createdAt: iso(row.createdAt) })),
    audits: auditRows.map((row) => ({ id: row.id, name: nameById.get(row.entityId) ?? row.entityType, userId: row.userId ?? "", userName: userRows.find((user) => user.id === row.userId)?.name ?? "System", action: row.action, entity: row.entityType, entityId: row.entityId, timestamp: iso(row.createdAt)!, before: row.beforeData ? JSON.stringify(row.beforeData, null, 2) : undefined, after: row.afterData ? JSON.stringify(row.afterData, null, 2) : undefined })),
  };
}

function assertPermission(user: DbUser, eventId: string, scoreOnly = false) {
  if (user.role === "SUPER_ADMIN") return;
  if (user.role === "EVENT_ADMIN" && user.assignedEventId === eventId) return;
  if (scoreOnly && user.role === "SCOREKEEPER" && user.assignedEventId === eventId) return;
  throw new Error("You do not have permission to change this tournament.");
}

async function log(user: DbUser, action: string, entity: string, entityId: string, afterData?: unknown) {
  await db.insert(auditLogs).values({ id: crypto.randomUUID(), userId: user.id, action, entityType: entity, entityId, afterData: afterData ?? null });
}

export async function saveTournamentRecord(user: DbUser, entity: Entity, record: RecordItem) {
  const now = new Date();
  if (entity === "events") {
    if (user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can manage events.");
    const item = record as Data["events"][number];
    await db.insert(events).values({ id: item.id, name: item.name, slug: item.slug, organizer: item.organizer, venue: item.venue, description: item.description, logoUrl: nullable(item.logo), bannerUrl: nullable(item.banner), startDate: new Date(item.startDate), endDate: new Date(item.endDate), status: item.status, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now }).onConflictDoUpdate({ target: events.id, set: { name: item.name, slug: item.slug, organizer: item.organizer, venue: item.venue, description: item.description, logoUrl: nullable(item.logo), bannerUrl: nullable(item.banner), startDate: new Date(item.startDate), endDate: new Date(item.endDate), status: item.status, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now } });
  } else if (entity === "categories") {
    const item = record as Data["categories"][number]; assertPermission(user, item.eventId);
    await db.insert(categories).values({ id: item.id, name: item.name, eventId: item.eventId, slug: item.name.toLowerCase().trim().replaceAll(/[^a-z0-9]+/g, "-"), scoringRule: item.rules, tieBreakRule: item.rules.tieBreak, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now }).onConflictDoUpdate({ target: categories.id, set: { name: item.name, scoringRule: item.rules, tieBreakRule: item.rules.tieBreak, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now } });
  } else if (entity === "groups") {
    const item = record as Data["groups"][number]; assertPermission(user, item.eventId);
    await db.insert(groups).values({ id: item.id, name: item.name, categoryId: item.categoryId, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now }).onConflictDoUpdate({ target: groups.id, set: { name: item.name, categoryId: item.categoryId, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now } });
  } else if (entity === "teams") {
    const item = record as Data["teams"][number]; assertPermission(user, item.eventId);
    await db.transaction(async (tx) => { await tx.insert(teams).values({ id: item.id, name: item.name, eventId: item.eventId, categoryId: item.categoryId, logoUrl: nullable(item.logo), seedNumber: item.seed ?? null, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now }).onConflictDoUpdate({ target: teams.id, set: { name: item.name, categoryId: item.categoryId, logoUrl: nullable(item.logo), seedNumber: item.seed ?? null, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now } }); await tx.delete(groupTeams).where(eq(groupTeams.teamId, item.id)); if (item.groupId) await tx.insert(groupTeams).values({ teamId: item.id, groupId: item.groupId }); });
  } else if (entity === "players") {
    const item = record as Data["players"][number]; assertPermission(user, item.eventId);
    await db.insert(players).values({ id: item.id, name: item.name, teamId: item.teamId, nickname: nullable(item.nickname), phone: nullable(item.phone), email: nullable(item.email), photoUrl: nullable(item.photo), deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now }).onConflictDoUpdate({ target: players.id, set: { name: item.name, teamId: item.teamId, nickname: nullable(item.nickname), phone: nullable(item.phone), email: nullable(item.email), photoUrl: nullable(item.photo), deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now } });
  } else if (entity === "courts") {
    const item = record as Data["courts"][number]; assertPermission(user, item.eventId);
    await db.insert(courts).values({ id: item.id, name: item.name, eventId: item.eventId, isActive: item.active, sortOrder: item.sortOrder, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now }).onConflictDoUpdate({ target: courts.id, set: { name: item.name, isActive: item.active, sortOrder: item.sortOrder, deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: now } });
  } else if (entity === "matches") {
    const item = record as Match; assertPermission(user, item.eventId);
    await replaceMatch(item);
  } else if (entity === "users") {
    if (user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can manage users.");
    const item = record as Data["users"][number];
    await db.update(users).set({ name: item.name, role: item.role, assignedEventId: nullable(item.eventId), updatedAt: now }).where(eq(users.id, item.id));
  }
  await log(user, "Saved record", entity, record.id, record);
}

async function replaceMatch(item: Match) {
  await db.transaction(async (tx) => {
    await tx.insert(matches).values({ id: item.id, eventId: item.eventId, categoryId: item.categoryId, groupId: nullable(item.groupId), stage: item.stage, teamAId: nullable(item.teamAId), teamBId: nullable(item.teamBId), courtId: nullable(item.courtId), scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null, status: item.status, winnerId: nullable(item.winnerId), nextMatchId: nullable(item.nextMatchId), nextMatchSlot: nullable(item.nextSlot), notes: nullable(item.notes), deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: new Date() }).onConflictDoUpdate({ target: matches.id, set: { categoryId: item.categoryId, groupId: nullable(item.groupId), stage: item.stage, teamAId: nullable(item.teamAId), teamBId: nullable(item.teamBId), courtId: nullable(item.courtId), scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null, status: item.status, winnerId: nullable(item.winnerId), nextMatchId: nullable(item.nextMatchId), nextMatchSlot: nullable(item.nextSlot), notes: nullable(item.notes), deletedAt: item.deletedAt ? new Date(item.deletedAt) : null, updatedAt: new Date() } });
    await tx.delete(matchSets).where(eq(matchSets.matchId, item.id));
    if (item.sets.length) await tx.insert(matchSets).values(item.sets.map((set, index) => ({ id: `${item.id}-set-${index + 1}`, matchId: item.id, setNumber: index + 1, teamAScore: set.a, teamBScore: set.b })));
  });
}

export async function saveScore(user: DbUser, matchId: string, sets: MatchSet[], status: Match["status"]) {
  const data = await readTournamentData(true);
  const match = data.matches.find((item) => item.id === matchId);
  if (!match) throw new Error("Match not found.");
  assertPermission(user, match.eventId, true);
  if (user.role === "SCOREKEEPER" && match.status === "FINISHED") throw new Error("An Event Admin must correct a finished result.");
  updateScore(data, matchId, sets, status);
  const ids = new Set([matchId, ...descendants(data, matchId)]);
  for (const id of ids) { const item = data.matches.find((candidate) => candidate.id === id); if (item) await replaceMatch(item); }
  await log(user, status === "FINISHED" ? "Published match result" : "Updated match score", "matches", matchId, { sets, status });
}

export async function deleteTournamentRecord(user: DbUser, entity: Entity, id: string, permanent: boolean) {
  const data = await readTournamentData(true);
  const record = (data[entity] as RecordItem[]).find((item) => item.id === id);
  if (!record) throw new Error("Record not found.");
  const eventId = entity === "events" ? id : "eventId" in record ? record.eventId : "";
  if (entity === "users" && user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can manage users.");
  else if (entity !== "users") assertPermission(user, eventId);
  if (entity === "users") {
    if (!permanent) throw new Error("User accounts cannot be moved to Trash. Delete them permanently instead.");
    if (user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can permanently delete records.");
    await db.delete(users).where(eq(users.id, id));
  } else {
    const table = { events, categories, groups, teams, players, courts, matches }[entity];
    if (permanent) { if (user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can permanently delete records."); await db.delete(table).where(eq(table.id, id)); }
    else await db.update(table).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(table.id, id));
  }
  await log(user, permanent ? "Permanently deleted" : "Moved to Trash", entity, id);
}

export async function restoreTournamentRecord(user: DbUser, entity: Entity, id: string) {
  const data = await readTournamentData(true);
  const record = (data[entity] as RecordItem[]).find((item) => item.id === id);
  if (!record) throw new Error("Record not found.");
  const eventId = entity === "events" ? id : "eventId" in record ? record.eventId : "";
  if (entity === "users" && user.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can manage users.");
  else if (entity !== "users") assertPermission(user, eventId);
  if (entity === "users") throw new Error("User accounts cannot be restored.");
  const table = { events, categories, groups, teams, players, courts, matches }[entity];
  await db.update(table).set({ deletedAt: null, updatedAt: new Date() }).where(eq(table.id, id));
  await log(user, "Restored", entity, id);
}
