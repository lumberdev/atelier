-- CreateEnum
CREATE TYPE "ProductListingType" AS ENUM ('COLLECTIONS', 'PRODUCTS');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "listType" "ProductListingType" NOT NULL,
    "resourceIds" TEXT[],
    "variantIds" TEXT[],
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("shop") ON DELETE RESTRICT ON UPDATE CASCADE;
