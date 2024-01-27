import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";
import prisma from "@/utils/prisma";
import { GetServerSidePropsContext, Redirect } from "next";

const getCampaignData = async ({
  identifier,
  handle,
}: {
  identifier: string;
  handle: string;
}) => {
  const merchant = await prisma.stores.findUnique({
    where: { identifier },
    select: {
      isActive: true,
      publicationId: true,
      secret: true,
      campaigns: {
        where: { handle },
        select: {
          id: true,
          collectionId: true,
          isActive: true,
          accessPageConfig: {
            select: {
              password: true,
            },
          },
        },
      },
      theme: true,
    },
  });

  const { isActive, publicationId, secret, campaigns, theme } = merchant;
  const [{ accessPageConfig, ...campaign }] = campaigns ?? [];

  return {
    merchant: { isActive, publicationId, secret },
    theme,
    campaign,
    config: accessPageConfig,
  };
};

const getCampaignForRequest = async ({
  req,
  campaignHandle,
}: {
  req: GetServerSidePropsContext["req"];
  campaignHandle: string;
}): Promise<
  | { data: Awaited<ReturnType<typeof getCampaignData>>; redirect?: never }
  | { redirect: Redirect; data?: never }
> => {
  const url = getServerSideRequestUrl(req);
  const [domain, subdomain] = url.hostname.split(".").reverse();

  // Trying to access campaign from top-level domain, not allowed
  if (!subdomain)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const data = await getCampaignData({
    identifier: subdomain,
    handle: campaignHandle,
  });

  return { data };
};

export default getCampaignForRequest;
