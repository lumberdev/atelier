-- CreateTable
CREATE TABLE "storeThemes" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "logo" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "backgroundColor" TEXT,
    "borderRadius" INTEGER DEFAULT 0,
    "logoPosition" TEXT DEFAULT 'left',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storeThemes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storeThemes_storeId_key" ON "storeThemes"("storeId");

-- AddForeignKey
ALTER TABLE "storeThemes" ADD CONSTRAINT "storeThemes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("shop") ON DELETE RESTRICT ON UPDATE CASCADE;
