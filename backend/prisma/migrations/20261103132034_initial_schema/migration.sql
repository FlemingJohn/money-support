-- CreateEnum
CREATE TYPE "CallChannel" AS ENUM ('phone', 'web');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('inProgress', 'ended');

-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('resolved', 'handedOff');

-- CreateEnum
CREATE TYPE "Speaker" AS ENUM ('agent', 'caller');

-- CreateEnum
CREATE TYPE "GuardrailKind" AS ENUM ('personalDataRemoved', 'unmaskedDataReported');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('open', 'inProgress', 'done');

-- CreateEnum
CREATE TYPE "ReviewReason" AS ENUM ('handOff', 'guardrail', 'lowConfidence');

-- CreateEnum
CREATE TYPE "ReviewVerdict" AS ENUM ('correct', 'wrong');

-- CreateEnum
CREATE TYPE "VerdictReason" AS ENUM ('shouldHaveAnswered', 'shouldHaveHandedOff', 'wrongInformation', 'tooLongOrUnclear', 'repeatedPersonalData');

-- CreateEnum
CREATE TYPE "CallbackStatus" AS ENUM ('ringingReviewer', 'ringingCaller', 'connected', 'ended', 'failed');

-- CreateEnum
CREATE TYPE "SettingsSection" AS ENUM ('agent', 'handOff', 'privacy', 'phone');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('callCompleted', 'callHandedOff', 'personalDataRemoved', 'transcriptViewed', 'unmaskedDataReported', 'reviewUpdated', 'reviewVerdictSaved', 'reviewResolved', 'callbackStarted', 'callbackEnded', 'faqCreated', 'faqUpdated', 'faqDeleted', 'faqsReordered', 'agentSynced', 'agentSyncFailed', 'settingsUpdated');

-- CreateEnum
CREATE TYPE "ActivityItemType" AS ENUM ('call', 'review', 'callback', 'faq', 'agent', 'settings');

-- CreateTable
CREATE TABLE "faqs" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" UUID NOT NULL,
    "content_hash" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" TEXT NOT NULL,
    "channel" "CallChannel" NOT NULL,
    "status" "CallStatus" NOT NULL DEFAULT 'inProgress',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "ended_reason" TEXT,
    "summary" TEXT,
    "topic" TEXT,
    "outcome" "CallOutcome",
    "masked_customer_number" TEXT,
    "encrypted_customer_number" TEXT,
    "matched_faq_id" UUID,
    "prompt_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_messages" (
    "id" UUID NOT NULL,
    "call_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "speaker" "Speaker" NOT NULL,
    "redacted_text" TEXT NOT NULL,
    "seconds_from_start" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "call_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracted_fields" (
    "id" UUID NOT NULL,
    "call_id" TEXT NOT NULL,
    "message_id" UUID,
    "number" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "start_offset" INTEGER,
    "end_offset" INTEGER,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "extracted_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardrail_events" (
    "id" UUID NOT NULL,
    "call_id" TEXT NOT NULL,
    "kind" "GuardrailKind" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardrail_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "call_id" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'open',
    "reason" "ReviewReason" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "verdict" "ReviewVerdict",
    "verdict_reason" "VerdictReason",
    "expected_behaviour" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("call_id")
);

-- CreateTable
CREATE TABLE "callbacks" (
    "id" UUID NOT NULL,
    "call_id" TEXT NOT NULL,
    "ring_phone" TEXT NOT NULL,
    "status" "CallbackStatus" NOT NULL DEFAULT 'ringingReviewer',
    "provider_call_id" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "connected_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "duration_seconds" INTEGER,

    CONSTRAINT "callbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "section" "SettingsSection" NOT NULL,
    "values" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("section")
);

-- CreateTable
CREATE TABLE "activity_events" (
    "id" UUID NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "item_type" "ActivityItemType" NOT NULL,
    "item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "faqs_sort_order_idx" ON "faqs"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_versions_content_hash_key" ON "prompt_versions"("content_hash");

-- CreateIndex
CREATE INDEX "calls_ended_at_idx" ON "calls"("ended_at");

-- CreateIndex
CREATE UNIQUE INDEX "call_messages_call_id_position_key" ON "call_messages"("call_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "extracted_fields_call_id_number_key" ON "extracted_fields"("call_id", "number");

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

-- CreateIndex
CREATE INDEX "activity_events_created_at_idx" ON "activity_events"("created_at");

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_matched_faq_id_fkey" FOREIGN KEY ("matched_faq_id") REFERENCES "faqs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_prompt_version_id_fkey" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_messages" ADD CONSTRAINT "call_messages_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_fields" ADD CONSTRAINT "extracted_fields_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_fields" ADD CONSTRAINT "extracted_fields_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "call_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardrail_events" ADD CONSTRAINT "guardrail_events_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "callbacks" ADD CONSTRAINT "callbacks_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "reviews"("call_id") ON DELETE CASCADE ON UPDATE CASCADE;
