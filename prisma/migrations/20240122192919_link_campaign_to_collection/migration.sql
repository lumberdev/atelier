/*
  Warnings:

  - You are about to drop the column `collectionIds` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `handle` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `productIds` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `variantIds` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "collectionIds",
DROP COLUMN "description",
DROP COLUMN "handle",
DROP COLUMN "image",
DROP COLUMN "productIds",
DROP COLUMN "title",
DROP COLUMN "variantIds",
ADD COLUMN     "collectionId" TEXT NOT NULL;
