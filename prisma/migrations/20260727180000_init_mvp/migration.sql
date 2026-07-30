-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'VIEWER');
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "ChannelType" AS ENUM ('GOOGLE_MAPS', 'WEBSITE', 'WHATSAPP');
CREATE TYPE "ChannelStatus" AS ENUM ('CONFIRMED', 'UNAVAILABLE', 'UNRECOGNIZED');
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'PARTIAL', 'FAILED');
CREATE TYPE "AnalysisKind" AS ENUM ('INITIAL', 'REANALYSIS');
CREATE TYPE "AnalysisJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'RETRY', 'SUCCEEDED', 'FAILED');
CREATE TYPE "AnalysisResultStatus" AS ENUM ('SCORED', 'INSUFFICIENT_COVERAGE');
CREATE TYPE "RecommendationImpact" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "RecommendationEffort" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "ActionStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'IGNORED', 'NOT_APPLICABLE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "identity_provider_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_email_normalized_check" CHECK ("email" = lower(trim("email")) AND length("email") BETWEEN 3 AND 254)
);

CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country_code" CHAR(2) NOT NULL DEFAULT 'BR',
    "status" "BusinessStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "businesses_name_check" CHECK (length(trim("name")) BETWEEN 2 AND 160),
    CONSTRAINT "businesses_normalized_name_check" CHECK (length(trim("normalized_name")) BETWEEN 2 AND 160),
    CONSTRAINT "businesses_city_check" CHECK (length(trim("city")) BETWEEN 2 AND 120),
    CONSTRAINT "businesses_country_code_check" CHECK ("country_code" ~ '^[A-Z]{2}$')
);

CREATE TABLE "business_memberships" (
    "user_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'OWNER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "business_memberships_pkey" PRIMARY KEY ("user_id", "business_id")
);

CREATE TABLE "business_channels" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "value" TEXT NOT NULL,
    "canonical_value" TEXT NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'CONFIRMED',
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_channels_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "business_channels_value_check" CHECK (length(trim("value")) BETWEEN 1 AND 2048),
    CONSTRAINT "business_channels_canonical_value_check" CHECK (length(trim("canonical_value")) BETWEEN 1 AND 2048),
    CONSTRAINT "business_channels_confirmation_check" CHECK ("status" <> 'CONFIRMED' OR "confirmed_at" IS NOT NULL)
);

CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "competitor_business_id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "competitors_position_check" CHECK ("position" BETWEEN 1 AND 3),
    CONSTRAINT "competitors_distinct_business_check" CHECK ("business_id" <> "competitor_business_id")
);

CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT NOT NULL,
    "baseline_analysis_id" TEXT,
    "kind" "AnalysisKind" NOT NULL DEFAULT 'INITIAL',
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "methodology_version" TEXT NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "failure_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "analyses_methodology_version_check" CHECK (length(trim("methodology_version")) BETWEEN 1 AND 80),
    CONSTRAINT "analyses_baseline_kind_check" CHECK (("kind" = 'INITIAL' AND "baseline_analysis_id" IS NULL) OR ("kind" = 'REANALYSIS' AND "baseline_analysis_id" IS NOT NULL)),
    CONSTRAINT "analyses_lifecycle_check" CHECK (("status" = 'PENDING' AND "started_at" IS NULL AND "completed_at" IS NULL) OR ("status" = 'PROCESSING' AND "started_at" IS NOT NULL AND "completed_at" IS NULL) OR ("status" IN ('COMPLETED', 'PARTIAL', 'FAILED') AND "completed_at" IS NOT NULL)),
    CONSTRAINT "analyses_completed_at_check" CHECK ("completed_at" IS NULL OR "started_at" IS NULL OR "completed_at" >= "started_at"),
    CONSTRAINT "analyses_failure_code_check" CHECK (("status" = 'FAILED' AND "failure_code" IS NOT NULL) OR ("status" <> 'FAILED' AND "failure_code" IS NULL))
);

CREATE TABLE "analysis_jobs" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "status" "AnalysisJobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_at" TIMESTAMP(3),
    "locked_by" TEXT,
    "last_error_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "analysis_jobs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "analysis_jobs_attempts_check" CHECK ("attempts" BETWEEN 0 AND 10),
    CONSTRAINT "analysis_jobs_lock_check" CHECK (("locked_at" IS NULL) = ("locked_by" IS NULL))
);

CREATE TABLE "analysis_results" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "status" "AnalysisResultStatus" NOT NULL,
    "total_score" INTEGER,
    "coverage_percentage" INTEGER NOT NULL,
    "dimensions" JSONB NOT NULL,
    "evidence" JSONB NOT NULL,
    "summary" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "analysis_results_score_check" CHECK ("total_score" IS NULL OR "total_score" BETWEEN 0 AND 100),
    CONSTRAINT "analysis_results_coverage_check" CHECK ("coverage_percentage" BETWEEN 0 AND 100),
    CONSTRAINT "analysis_results_scored_check" CHECK (("status" = 'SCORED' AND "total_score" IS NOT NULL) OR ("status" = 'INSUFFICIENT_COVERAGE' AND "total_score" IS NULL)),
    CONSTRAINT "analysis_results_json_check" CHECK (jsonb_typeof("dimensions") = 'array' AND jsonb_typeof("evidence") = 'array' AND jsonb_typeof("summary") = 'object')
);

CREATE TABLE "analysis_competitors" (
    "analysis_id" TEXT NOT NULL,
    "primary_business_id" TEXT NOT NULL,
    "competitor_business_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analysis_competitors_pkey" PRIMARY KEY ("analysis_id", "competitor_business_id"),
    CONSTRAINT "analysis_competitors_position_check" CHECK ("position" BETWEEN 1 AND 3),
    CONSTRAINT "analysis_competitors_distinct_business_check" CHECK ("primary_business_id" <> "competitor_business_id")
);

CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "evidence_keys" JSONB NOT NULL,
    "impact" "RecommendationImpact" NOT NULL,
    "effort" "RecommendationEffort" NOT NULL,
    "confidence" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "steps" JSONB NOT NULL,
    "generator_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "recommendations_confidence_check" CHECK ("confidence" BETWEEN 0 AND 100),
    CONSTRAINT "recommendations_priority_check" CHECK ("priority" BETWEEN 1 AND 5),
    CONSTRAINT "recommendations_title_check" CHECK (length(trim("title")) BETWEEN 2 AND 160),
    CONSTRAINT "recommendations_rationale_check" CHECK (length(trim("rationale")) BETWEEN 2 AND 1000),
    CONSTRAINT "recommendations_json_check" CHECK (jsonb_typeof("evidence_keys") = 'array' AND jsonb_typeof("steps") = 'array' AND jsonb_array_length("evidence_keys") > 0 AND jsonb_array_length("steps") BETWEEN 1 AND 8)
);

CREATE TABLE "recommendation_actions" (
    "id" TEXT NOT NULL,
    "recommendation_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "note" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "recommendation_actions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "recommendation_actions_note_check" CHECK ("note" IS NULL OR length("note") <= 1000),
    CONSTRAINT "recommendation_actions_started_check" CHECK ("status" NOT IN ('IN_PROGRESS', 'COMPLETED') OR "started_at" IS NOT NULL),
    CONSTRAINT "recommendation_actions_completed_check" CHECK ("status" <> 'COMPLETED' OR "completed_at" IS NOT NULL),
    CONSTRAINT "recommendation_actions_dates_check" CHECK ("completed_at" IS NULL OR "started_at" IS NULL OR "completed_at" >= "started_at")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_identity_provider_id_key" ON "users"("identity_provider_id");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "businesses_normalized_name_city_idx" ON "businesses"("normalized_name", "city");
CREATE INDEX "business_memberships_business_id_idx" ON "business_memberships"("business_id");
CREATE UNIQUE INDEX "business_channels_business_id_type_key" ON "business_channels"("business_id", "type");
CREATE INDEX "business_channels_type_canonical_value_idx" ON "business_channels"("type", "canonical_value");
CREATE UNIQUE INDEX "competitors_business_id_competitor_business_id_key" ON "competitors"("business_id", "competitor_business_id");
CREATE UNIQUE INDEX "competitors_business_id_position_key" ON "competitors"("business_id", "position");
CREATE INDEX "competitors_competitor_business_id_idx" ON "competitors"("competitor_business_id");
CREATE INDEX "competitors_created_by_user_id_idx" ON "competitors"("created_by_user_id");
CREATE INDEX "analyses_business_id_created_at_idx" ON "analyses"("business_id", "created_at" DESC);
CREATE INDEX "analyses_requested_by_user_id_idx" ON "analyses"("requested_by_user_id");
CREATE INDEX "analyses_baseline_analysis_id_idx" ON "analyses"("baseline_analysis_id");
CREATE INDEX "analyses_status_created_at_idx" ON "analyses"("status", "created_at");
CREATE UNIQUE INDEX "analysis_jobs_analysis_id_key" ON "analysis_jobs"("analysis_id");
CREATE INDEX "analysis_jobs_status_available_at_idx" ON "analysis_jobs"("status", "available_at");
CREATE UNIQUE INDEX "analysis_results_analysis_id_key" ON "analysis_results"("analysis_id");
CREATE UNIQUE INDEX "analysis_competitors_analysis_id_position_key" ON "analysis_competitors"("analysis_id", "position");
CREATE INDEX "analysis_competitors_primary_business_id_idx" ON "analysis_competitors"("primary_business_id");
CREATE INDEX "analysis_competitors_competitor_business_id_idx" ON "analysis_competitors"("competitor_business_id");
CREATE UNIQUE INDEX "recommendations_analysis_id_key_key" ON "recommendations"("analysis_id", "key");
CREATE UNIQUE INDEX "recommendations_analysis_id_priority_key" ON "recommendations"("analysis_id", "priority");
CREATE INDEX "recommendations_analysis_id_priority_idx" ON "recommendations"("analysis_id", "priority");
CREATE UNIQUE INDEX "recommendation_actions_recommendation_id_business_id_key" ON "recommendation_actions"("recommendation_id", "business_id");
CREATE INDEX "recommendation_actions_business_id_status_idx" ON "recommendation_actions"("business_id", "status");
CREATE INDEX "recommendation_actions_user_id_idx" ON "recommendation_actions"("user_id");

-- AddForeignKey
ALTER TABLE "business_memberships" ADD CONSTRAINT "business_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "business_memberships" ADD CONSTRAINT "business_memberships_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "business_channels" ADD CONSTRAINT "business_channels_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_competitor_business_id_fkey" FOREIGN KEY ("competitor_business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_baseline_analysis_id_fkey" FOREIGN KEY ("baseline_analysis_id") REFERENCES "analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "analysis_jobs" ADD CONSTRAINT "analysis_jobs_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analysis_competitors" ADD CONSTRAINT "analysis_competitors_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analysis_competitors" ADD CONSTRAINT "analysis_competitors_primary_business_id_fkey" FOREIGN KEY ("primary_business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "analysis_competitors" ADD CONSTRAINT "analysis_competitors_competitor_business_id_fkey" FOREIGN KEY ("competitor_business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recommendation_actions" ADD CONSTRAINT "recommendation_actions_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recommendation_actions" ADD CONSTRAINT "recommendation_actions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recommendation_actions" ADD CONSTRAINT "recommendation_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
