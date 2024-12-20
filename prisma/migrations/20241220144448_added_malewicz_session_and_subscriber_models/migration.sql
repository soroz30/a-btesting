/*
  Warnings:

  - You are about to drop the column `scenario` on the `MalewiczSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `subscribedAt` on the `MalewiczSubscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MalewiczSubscriber" DROP COLUMN "scenario",
DROP COLUMN "subscribedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "MalewiczSession" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriberId" INTEGER,

    CONSTRAINT "MalewiczSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MalewiczSession_uniqueId_key" ON "MalewiczSession"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "MalewiczSession_subscriberId_key" ON "MalewiczSession"("subscriberId");

-- AddForeignKey
ALTER TABLE "MalewiczSession" ADD CONSTRAINT "MalewiczSession_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "MalewiczSubscriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
