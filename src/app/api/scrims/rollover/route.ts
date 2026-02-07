import { NextResponse } from "next/server";
import { runDailyScrimRollover } from "@/lib/actions/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyScrimRollover();
  return NextResponse.json(result);
}
