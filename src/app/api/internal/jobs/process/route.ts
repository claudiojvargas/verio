import { randomUUID, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { getServerEnvironment } from "@/lib/env/server";
import { AIAnalyzerError } from "@/modules/ai-analyzer";
import { processNextAnalysisJob } from "@/modules/analyses/application/run-analysis";

export async function POST(request: Request) {
  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!isAuthorized(token, getServerEnvironment().INTERNAL_JOB_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const analysisId = await processNextAnalysisJob(`internal-${randomUUID()}`);
    return NextResponse.json({ processed: Boolean(analysisId), analysisId });
  } catch (error) {
    const code =
      error instanceof AIAnalyzerError
        ? error.code
        : error instanceof Error && error.message === "NO_CONFIRMED_CHANNELS"
          ? error.message
          : "ANALYSIS_EXECUTION_FAILED";
    console.error("Analysis job processing failed", { code });
    return NextResponse.json(
      { error: "processing_failed", code },
      { status: 500 },
    );
  }
}

function isAuthorized(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}
