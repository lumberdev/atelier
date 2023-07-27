/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `stores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stores_identifier_key" ON "stores"("identifier");
