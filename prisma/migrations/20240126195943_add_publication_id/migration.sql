/*
  Warnings:

  - Added the required column `publicationId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "publicationId" TEXT NOT NULL;
