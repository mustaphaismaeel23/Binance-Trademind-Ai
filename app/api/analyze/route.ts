import { NextResponse } from "next/server";
import { z } from "zod";
import { runTradeMindAnalysis } from "@/lib/agent/orchestrator";

const bodySchema = z.object({
  query: z.string().trim().min(3, "Please enter a longer research query.").max(500),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const result = await runTradeMindAnalysis(body.query);
    const status = result.error ? 500 : 200;
    return NextResponse.json(result, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
