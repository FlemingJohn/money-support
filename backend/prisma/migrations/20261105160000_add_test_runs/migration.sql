CREATE TABLE "test_runs" (
    "id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL,
    "passed_count" INTEGER NOT NULL,
    "total_count" INTEGER NOT NULL,
    "results" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "test_runs_finished_at_idx" ON "test_runs"("finished_at");

