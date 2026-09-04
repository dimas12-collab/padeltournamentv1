import "dotenv/config";
import { createSeed } from "@/lib/seed";
import { db } from "./index";
import { categories, courts, events, groupTeams, groups, matchSets, matches, players, teams } from "./schema";

const demo = createSeed();
const iso = (date: string) => new Date(date.includes("T") ? date : `${date}T00:00:00+08:00`);

async function main() {
  await db.transaction(async (tx) => {
  await tx.insert(events).values(demo.events.map((event) => ({ id: event.id, name: event.name, slug: event.slug, organizer: event.organizer, venue: event.venue, description: event.description, logoUrl: event.logo, bannerUrl: event.banner, startDate: iso(event.startDate), endDate: iso(event.endDate), status: event.status }))).onConflictDoNothing();
  await tx.insert(categories).values(demo.categories.map((category) => ({ id: category.id, eventId: category.eventId, name: category.name, slug: category.name.toLowerCase().replaceAll(" ", "-"), scoringRule: category.rules, tieBreakRule: category.rules.tieBreak }))).onConflictDoNothing();
  await tx.insert(groups).values(demo.groups.map((group, sortOrder) => ({ id: group.id, categoryId: group.categoryId, name: group.name, sortOrder }))).onConflictDoNothing();
  await tx.insert(teams).values(demo.teams.map((team) => ({ id: team.id, eventId: team.eventId, categoryId: team.categoryId, name: team.name, logoUrl: team.logo, seedNumber: team.seed }))).onConflictDoNothing();
  await tx.insert(groupTeams).values(demo.teams.filter((team) => team.groupId).map((team) => ({ groupId: team.groupId!, teamId: team.id }))).onConflictDoNothing();
  await tx.insert(players).values(demo.players.map((player) => ({ id: player.id, teamId: player.teamId, name: player.name, nickname: player.nickname, photoUrl: player.photo, phone: player.phone, email: player.email }))).onConflictDoNothing();
  await tx.insert(courts).values(demo.courts.map((court) => ({ id: court.id, eventId: court.eventId, name: court.name, sortOrder: court.sortOrder, isActive: court.active }))).onConflictDoNothing();
  await tx.insert(matches).values(demo.matches.map((match) => ({ id: match.id, eventId: match.eventId, categoryId: match.categoryId, groupId: match.groupId, stage: match.stage, teamAId: match.teamAId || null, teamBId: match.teamBId || null, courtId: match.courtId, scheduledAt: match.scheduledAt ? iso(match.scheduledAt) : null, status: match.status, winnerId: match.winnerId, nextMatchId: match.nextMatchId, nextMatchSlot: match.nextSlot, notes: match.notes }))).onConflictDoNothing();
  await tx.insert(matchSets).values(demo.matches.flatMap((match) => match.sets.map((set, index) => ({ id: `${match.id}-set-${index + 1}`, matchId: match.id, setNumber: index + 1, teamAScore: set.a, teamBScore: set.b })))).onConflictDoNothing();
  });

  console.log("Tournament sample data seeded. Create the first admin at /sign-up, then grant its role in the users table.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
