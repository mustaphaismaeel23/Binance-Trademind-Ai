import { NextResponse } from "next/server";
import { z } from "zod";
import { runTradeMindAnalysis } from "@/lib/agent/orchestrator";

const bodySchema = z.object({
  query: z.string().trim().min(3, "Please enter a longer research query.").max(500),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const body = bodySchema.parse({
      query: rawBody?.query ?? "Analyze BTC for a short-term trade and identify the major risks.",
    });
    const result = await runTradeMindAnalysis(body.query);
    const status = result.error ? 500 : 200;
    return NextResponse.json(result, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
