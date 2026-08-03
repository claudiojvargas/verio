CREATE TABLE "analysis_events" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "code" TEXT,
    "public_message" TEXT NOT NULL,
    "technical_message" TEXT,
    "metadata" JSONB,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_events_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "analysis_events_status_check"
        CHECK ("status" IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
    CONSTRAINT "analysis_events_duration_ms_check"
        CHECK ("duration_ms" IS NULL OR "duration_ms" >= 0)
);

CREATE INDEX "analysis_events_analysis_id_created_at_idx"
    ON "analysis_events"("analysis_id", "created_at");

ALTER TABLE "analysis_events"
    ADD CONSTRAINT "analysis_events_analysis_id_fkey"
    FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
