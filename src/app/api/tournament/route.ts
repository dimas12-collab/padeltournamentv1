import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/permissions";
import { deleteTournamentRecord, readTournamentData, restoreTournamentRecord, saveScore, saveTournamentRecord } from "@/lib/tournament-db";
import type { Entity, Match, MatchSet, RecordItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return NextResponse.json({ data: await readTournamentData(Boolean(session?.user)), userId: session?.user?.id ?? null });
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await request.json() as { action: "save" | "score" | "delete" | "restore"; entity?: Entity; record?: RecordItem; id?: string; permanent?: boolean; sets?: MatchSet[]; status?: Match["status"] };
    if (body.action === "save" && body.entity && body.record) await saveTournamentRecord(user, body.entity, body.record);
    else if (body.action === "score" && body.id && body.sets && body.status) await saveScore(user, body.id, body.sets, body.status);
    else if (body.action === "delete" && body.entity && body.id) await deleteTournamentRecord(user, body.entity, body.id, Boolean(body.permanent));
    else if (body.action === "restore" && body.entity && body.id) await restoreTournamentRecord(user, body.entity, body.id);
    else return NextResponse.json({ error: "Invalid tournament operation." }, { status: 400 });
    return NextResponse.json({ data: await readTournamentData(true), userId: user.id });
  } catch (error) {
    const status = error instanceof Response ? error.status : 400;
    const message = error instanceof Response ? await error.text() : error instanceof Error ? error.message : "Tournament operation failed.";
    return NextResponse.json({ error: message }, { status });
  }
}
