ALTER TABLE "reviews" ADD COLUMN "hand_off_emailed_at" TIMESTAMP(3);

ALTER TYPE "ActivityAction" ADD VALUE 'handOffEmailSent';

ALTER TYPE "ActivityAction" ADD VALUE 'handOffEmailFailed';
