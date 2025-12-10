/*
  Warnings:

  - You are about to drop the column `new` on the `boilerPart` table. All the data in the column will be lost.
  - You are about to drop the column `prise` on the `boilerPart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boilerPart" DROP COLUMN "new",
DROP COLUMN "prise",
ADD COLUMN     "newBoilerPart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
