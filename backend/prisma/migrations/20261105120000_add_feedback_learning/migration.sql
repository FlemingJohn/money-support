CREATE TYPE "ReviewTestCheck" AS ENUM ('answers', 'handsOff');

CREATE TYPE "ReviewTestResult" AS ENUM ('notRun', 'passed', 'failed');

CREATE TYPE "PromptSuggestionStatus" AS ENUM ('testing', 'pending', 'approved', 'rejected', 'discarded');

ALTER TYPE "ActivityAction" ADD VALUE 'callReanalysed';
ALTER TYPE "ActivityAction" ADD VALUE 'maskingMissRecorded';
ALTER TYPE "ActivityAction" ADD VALUE 'reviewTestCreated';
ALTER TYPE "ActivityAction" ADD VALUE 'reviewTestsRun';
ALTER TYPE "ActivityAction" ADD VALUE 'suggestionCreated';
ALTER TYPE "ActivityAction" ADD VALUE 'suggestionApproved';
ALTER TYPE "ActivityAction" ADD VALUE 'suggestionRejected';
ALTER TYPE "ActivityAction" ADD VALUE 'promptRuleToggled';

ALTER TYPE "ActivityItemType" ADD VALUE 'reviewTest';
ALTER TYPE "ActivityItemType" ADD VALUE 'suggestion';
ALTER TYPE "ActivityItemType" ADD VALUE 'promptRule';

ALTER TABLE "reviews" ADD COLUMN     "verdict_message_id" UUID;

CREATE TABLE "masking_misses" (
    "id" UUID NOT NULL,
    "call_id" TEXT,
    "message_id" UUID,
    "kind" TEXT NOT NULL,
    "masked_pattern" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "masking_misses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "review_tests" (
    "id" UUID NOT NULL,
    "number" SERIAL NOT NULL,
    "review_call_id" TEXT,
    "caller_line" TEXT NOT NULL,
    "check" "ReviewTestCheck" NOT NULL,
    "expectation" TEXT NOT NULL DEFAULT '',
    "verdict_reason" "VerdictReason" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_result" "ReviewTestResult" NOT NULL DEFAULT 'notRun',
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_tests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prompt_suggestions" (
    "id" UUID NOT NULL,
    "rule_text" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "status" "PromptSuggestionStatus" NOT NULL DEFAULT 'testing',
    "passed_before" INTEGER,
    "passed_after" INTEGER,
    "total_tests" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMP(3),

    CONSTRAINT "prompt_suggestions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prompt_suggestion_reviews" (
    "suggestion_id" UUID NOT NULL,
    "review_call_id" TEXT NOT NULL,

    CONSTRAINT "prompt_suggestion_reviews_pkey" PRIMARY KEY ("suggestion_id","review_call_id")
);

CREATE TABLE "prompt_rules" (
    "id" UUID NOT NULL,
    "rule_text" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "suggestion_id" UUID,
    "added_in_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_rules_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "review_tests_number_key" ON "review_tests"("number");

CREATE UNIQUE INDEX "review_tests_review_call_id_key" ON "review_tests"("review_call_id");

CREATE INDEX "prompt_suggestions_created_at_idx" ON "prompt_suggestions"("created_at");

CREATE UNIQUE INDEX "prompt_rules_suggestion_id_key" ON "prompt_rules"("suggestion_id");

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_verdict_message_id_fkey" FOREIGN KEY ("verdict_message_id") REFERENCES "call_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "masking_misses" ADD CONSTRAINT "masking_misses_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "masking_misses" ADD CONSTRAINT "masking_misses_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "call_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "review_tests" ADD CONSTRAINT "review_tests_review_call_id_fkey" FOREIGN KEY ("review_call_id") REFERENCES "reviews"("call_id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "prompt_suggestion_reviews" ADD CONSTRAINT "prompt_suggestion_reviews_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "prompt_suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "prompt_suggestion_reviews" ADD CONSTRAINT "prompt_suggestion_reviews_review_call_id_fkey" FOREIGN KEY ("review_call_id") REFERENCES "reviews"("call_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "prompt_rules" ADD CONSTRAINT "prompt_rules_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "prompt_suggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "prompt_rules" ADD CONSTRAINT "prompt_rules_added_in_version_id_fkey" FOREIGN KEY ("added_in_version_id") REFERENCES "prompt_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
