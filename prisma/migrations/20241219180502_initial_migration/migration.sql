-- CreateTable
CREATE TABLE "MalewiczSubscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MalewiczSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MalewiczSubscriber_email_key" ON "MalewiczSubscriber"("email");
