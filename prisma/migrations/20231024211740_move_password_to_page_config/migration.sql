/*
  Warnings:

  - You are about to drop the column `password` on the `campaigns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "accessPageConfig" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "layout" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "body" TEXT,
    "password" TEXT,
    "passwordPlaceholder" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "backgroundColor" TEXT,
    "backgroundImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessPageConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accessPageConfig_campaignId_key" ON "accessPageConfig"("campaignId");

-- AddForeignKey
ALTER TABLE "accessPageConfig" ADD CONSTRAINT "accessPageConfig_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
