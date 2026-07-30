ALTER TABLE "analysis_competitors"
ADD COLUMN "total_score" INTEGER,
ADD COLUMN "coverage_percentage" INTEGER,
ADD COLUMN "dimensions" JSONB;

ALTER TABLE "analysis_competitors"
ADD CONSTRAINT "analysis_competitors_score_check"
CHECK ("total_score" IS NULL OR "total_score" BETWEEN 0 AND 100),
ADD CONSTRAINT "analysis_competitors_coverage_check"
CHECK ("coverage_percentage" IS NULL OR "coverage_percentage" BETWEEN 0 AND 100),
ADD CONSTRAINT "analysis_competitors_dimensions_check"
CHECK ("dimensions" IS NULL OR jsonb_typeof("dimensions") = 'array'),
ADD CONSTRAINT "analysis_competitors_result_consistency_check"
CHECK (
  ("total_score" IS NULL AND "coverage_percentage" IS NULL AND "dimensions" IS NULL)
  OR
  ("total_score" IS NOT NULL AND "coverage_percentage" IS NOT NULL AND "dimensions" IS NOT NULL)
);
