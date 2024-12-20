/*
  Warnings:

  - You are about to drop the column `email` on the `MalewiczSubscriber` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MalewiczSubscriber_email_key";

-- AlterTable
ALTER TABLE "MalewiczSubscriber" DROP COLUMN "email";
