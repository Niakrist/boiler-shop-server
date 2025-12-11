/*
  Warnings:

  - You are about to drop the column `bestsellers` on the `boilerPart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boilerPart" DROP COLUMN "bestsellers",
ADD COLUMN     "bestseller" BOOLEAN NOT NULL DEFAULT false;
