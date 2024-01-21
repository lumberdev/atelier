-- DropForeignKey
ALTER TABLE "accessPageConfig" DROP CONSTRAINT "accessPageConfig_campaignId_fkey";

-- AddForeignKey
ALTER TABLE "accessPageConfig" ADD CONSTRAINT "accessPageConfig_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
