/*
  Warnings:

  - Added the required column `handle` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "handle" TEXT NOT NULL;
