ALTER TABLE "analysis_competitors"
ADD COLUMN "name_snapshot" TEXT,
ADD COLUMN "city_snapshot" TEXT,
ADD COLUMN "state_snapshot" TEXT,
ADD COLUMN "channels_snapshot" JSONB NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN "result_status" "AnalysisResultStatus",
ADD COLUMN "evidence" JSONB;

UPDATE "analysis_competitors" AS snapshot
SET
  "name_snapshot" = business."name",
  "city_snapshot" = business."city",
  "state_snapshot" = business."state",
  "channels_snapshot" = COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'type', channel."type",
          'value', channel."value",
          'status', channel."status"
        )
        ORDER BY channel."type"
      )
      FROM "business_channels" AS channel
      WHERE channel."business_id" = snapshot."competitor_business_id"
    ),
    '[]'::jsonb
  ),
  "result_status" = CASE
    WHEN snapshot."dimensions" IS NULL THEN NULL
    WHEN snapshot."total_score" IS NULL THEN 'INSUFFICIENT_COVERAGE'::"AnalysisResultStatus"
    ELSE 'SCORED'::"AnalysisResultStatus"
  END,
  "evidence" = CASE
    WHEN snapshot."dimensions" IS NULL THEN NULL
    ELSE '[]'::jsonb
  END
FROM "businesses" AS business
WHERE business."id" = snapshot."competitor_business_id";

ALTER TABLE "analysis_competitors"
ALTER COLUMN "name_snapshot" SET NOT NULL,
ALTER COLUMN "city_snapshot" SET NOT NULL,
ALTER COLUMN "channels_snapshot" DROP DEFAULT;

ALTER TABLE "analysis_competitors"
DROP CONSTRAINT "analysis_competitors_result_consistency_check";

ALTER TABLE "analysis_competitors"
ADD CONSTRAINT "analysis_competitors_channels_snapshot_check"
CHECK (jsonb_typeof("channels_snapshot") = 'array'),
ADD CONSTRAINT "analysis_competitors_evidence_check"
CHECK ("evidence" IS NULL OR jsonb_typeof("evidence") = 'array'),
ADD CONSTRAINT "analysis_competitors_result_consistency_check"
CHECK (
  (
    "result_status" IS NULL
    AND "total_score" IS NULL
    AND "coverage_percentage" IS NULL
    AND "dimensions" IS NULL
    AND "evidence" IS NULL
  )
  OR
  (
    "result_status" IS NOT NULL
    AND "coverage_percentage" IS NOT NULL
    AND "dimensions" IS NOT NULL
    AND "evidence" IS NOT NULL
    AND (
      ("result_status" = 'SCORED' AND "total_score" IS NOT NULL)
      OR
      ("result_status" = 'INSUFFICIENT_COVERAGE' AND "total_score" IS NULL)
    )
  )
);
