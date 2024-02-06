import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";
import prisma from "@/utils/prisma";
import { GetServerSidePropsContext, Redirect } from "next";

const getCampaignForRequest = async ({
  req,
  campaignHandle,
}: {
  req: GetServerSidePropsContext["req"];
  campaignHandle: string;
}): Promise<
  | {
      data: Awaited<ReturnType<typeof getCampaignData>>;
      redirect?: never;
      notFound?: never;
    }
  | { redirect: Redirect; data?: never; notFound?: never }
  | { notFound: true; data?: never; redirect?: never }
> => {
  const { url, subdomain } = getServerSideRequestUrl(req);

  // Trying to access campaign from top-level domain, not allowed
  if (!subdomain)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  console.log("[AT]", { subdomain, campaignHandle });
  const data = await getCampaignData({
    identifier: subdomain,
    handle: campaignHandle,
  });
  console.log("[AT]", { data });

  if (!data)
    return {
      notFound: true,
    };

  return { data };
};

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
      shop: true,
      campaigns: {
        where: { handle },
        select: {
          id: true,
          collectionId: true,
          isActive: true,
          previewToken: true,
          announcement: true,
          cartBackgroundColor: true,
          cartCheckoutButtonStyle: true,
          cartDescription: true,
          cartItemsImageStyle: true,
          cartTextColor: true,
          cartTitle: true,
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

  console.log("[AT]", { identifier, handle, merchant });

  if (!merchant || !merchant.campaigns.length) return null;

  const { isActive, publicationId, secret, shop, campaigns, theme } = merchant;
  const [{ accessPageConfig, ...campaign }] = campaigns ?? [];

  return {
    merchant: { isActive, publicationId, secret, shop },
    theme,
    campaign,
    config: accessPageConfig,
  };
};

export default getCampaignForRequest;
