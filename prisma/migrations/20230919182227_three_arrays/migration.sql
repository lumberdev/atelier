/*
  Warnings:

  - You are about to drop the column `resourceIds` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `campaigns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "resourceIds",
DROP COLUMN "resourceType",
ADD COLUMN     "collectionIds" TEXT[],
ADD COLUMN     "productIds" TEXT[];

-- DropEnum
DROP TYPE "ResourceType";
