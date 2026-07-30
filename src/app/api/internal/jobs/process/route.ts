import { randomUUID, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { getServerEnvironment } from "@/lib/env/server";
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
  } catch {
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
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
