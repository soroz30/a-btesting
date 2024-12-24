-- CreateTable
CREATE TABLE "WaveSession" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriberId" INTEGER,

    CONSTRAINT "WaveSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaveSubscriber" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaveSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaveSession_uniqueId_key" ON "WaveSession"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "WaveSession_subscriberId_key" ON "WaveSession"("subscriberId");

-- AddForeignKey
ALTER TABLE "WaveSession" ADD CONSTRAINT "WaveSession_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "WaveSubscriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
