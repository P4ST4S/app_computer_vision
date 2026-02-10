import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const level = payload?.level ?? "info";
    const event = payload?.event ?? "unknown_event";
    const ts = payload?.ts ?? new Date().toISOString();
    const details = payload?.details ?? {};

    const line = `[ClientDiag] ${ts} ${level.toUpperCase()} ${event} ${JSON.stringify(details)}`;

    if (level === "error") {
      console.error(line);
    } else if (level === "warn") {
      console.warn(line);
    } else {
      console.log(line);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ClientDiag] Failed to parse diagnostics payload:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

