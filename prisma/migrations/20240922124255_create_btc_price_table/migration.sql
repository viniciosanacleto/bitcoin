-- CreateTable
CREATE TABLE "BtcPrice" (
    "id" TEXT NOT NULL,
    "buy" DECIMAL(20,8) NOT NULL,
    "sell" DECIMAL(20,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BtcPrice_pkey" PRIMARY KEY ("id")
);
