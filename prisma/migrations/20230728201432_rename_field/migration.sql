/*
  Warnings:

  - You are about to drop the column `listType` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `resourceType` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COLLECTIONS', 'PRODUCTS');

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "listType",
ADD COLUMN     "resourceType" "ResourceType" NOT NULL;

-- DropEnum
DROP TYPE "ProductListingType";
