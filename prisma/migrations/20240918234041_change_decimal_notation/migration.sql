/*
  Warnings:

  - You are about to alter the column `value` on the `Position` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,8)` to `Decimal(20,8)`.
  - You are about to alter the column `btcPrice` on the `Position` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,8)` to `Decimal(20,8)`.
  - You are about to alter the column `btcQty` on the `Position` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,8)` to `Decimal(20,8)`.
  - You are about to alter the column `balance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,8)` to `Decimal(20,8)`.

*/
-- AlterTable
ALTER TABLE "Position" ALTER COLUMN "value" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "btcPrice" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "btcQty" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(20,8);
