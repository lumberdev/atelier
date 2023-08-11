import prisma from "@/utils/prisma";
import { campaigns } from "@prisma/client";
import { Page } from "@shopify/polaris";
import { FC } from "react";
import { useRouter } from "next/router";
import CampaignForm from "@/components/CampaignForm";
import { useQuery } from "react-query";
import useFetch from "@/components/hooks/useFetch";
import { CollectionResourceItem, ProductResourceItem } from "@/lib/types";

export const getServerSideProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const campaign = await prisma.campaigns.findUnique({
    where: { id },
  });

  return { props: { data: { campaign } } };
};

const CampaignPage: FC<{ data: { campaign: campaigns } }> = ({
  data: { campaign },
}) => {
  const router = useRouter();
  const fetch = useFetch();

  const { data } = useQuery<{
    campaign: campaigns;
    resources: CollectionResourceItem[] | ProductResourceItem[];
  }>({
    queryKey: ["campaign", campaign.id],
    queryFn: () =>
      fetch(`/api/apps/campaigns/${campaign.id}`).then((response) =>
        response.json()
      ),
  });

  return (
    <Page
      title={campaign.title}
      backAction={{ content: "Campaigns", onAction: () => router.push("/app") }}
    >
      {data && (
        <CampaignForm campaign={data.campaign} resources={data.resources} />
      )}
    </Page>
  );
};

export default CampaignPage;
