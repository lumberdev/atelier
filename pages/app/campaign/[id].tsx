import prisma from "@/utils/prisma";
import { FC } from "react";
import { useRouter } from "next/router";
import CampaignPage from "@/components/campaign/Page";
import { CampaignFlatFields, CampaignQueryFields } from "@/lib/types";
import useCollection from "@/lib/hooks/app/useCollection";
import CampaignSkeletonPage from "@/components/campaign/SkeletonPage";
import flattenCampaignFields from "@/utils/flattenCampaignFields";
import getIdFromGid from "@/utils/getIdFromGid";

const EditCampaignPage: FC<{
  data: { campaign: CampaignFlatFields; collectionId: string };
}> = ({ data: { campaign, collectionId } }) => {
  const router = useRouter();
  const { isLoading, goToNextPage, goToPreviousPage, ...collection } =
    useCollection(collectionId);

  if (isLoading) return <CampaignSkeletonPage />;

  return (
    <CampaignPage
      collection={collection}
      campaign={campaign}
      pagination={{
        goToNextPage,
        goToPreviousPage,
      }}
      backAction={{
        content: "Campaign",
        onAction: () => router.back(),
      }}
    />
  );
};

export default EditCampaignPage;

export const getServerSideProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const campaign: CampaignQueryFields = await prisma.campaigns.findUnique({
    where: { id },
    include: {
      accessPageConfig: true,
    },
  });

  const collectionId = getIdFromGid(campaign.collectionId);

  const fields = flattenCampaignFields(campaign);

  return { props: { data: { campaign: fields, collectionId } } };
};
