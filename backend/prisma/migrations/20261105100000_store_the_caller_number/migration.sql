ALTER TABLE "calls" RENAME COLUMN "encrypted_customer_number" TO "customer_number";

UPDATE "calls" SET "customer_number" = NULL;
