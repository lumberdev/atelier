-- CreateTable
CREATE TABLE "categoryTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prodIds" TEXT[],

    CONSTRAINT "categoryTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoryTag_name_key" ON "categoryTag"("name");
