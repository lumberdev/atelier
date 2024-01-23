import { PublicationCollectionListing } from "@/lib/types";
import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
import prisma from "@/utils/prisma";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.get(async (req, res) => {
  const shop = req.user_session.shop;

  const { client: graphqlClient } = await clientProvider.offline.graphqlClient({
    shop,
  });

  const response = await graphqlClient.query({
    data: `
      query ShopPublication {
        currentAppInstallation {
          publication {
            id
            collections(first: 100) {
              edges {
                node {
                  id
                  handle
                  title
                  productsCount
                }
              }
            }
          }
        }
      }
    `,
  });

  const publication = (response.body as any).data?.currentAppInstallation
    .publication;
  const collections = publication?.collections.edges ?? [];

  const collectionIds = collections.map(
    ({ node: collection }) => collection.id
  );

  const campaigns = await prisma.campaigns.findMany({
    where: {
      collectionId: { in: collectionIds },
    },
    select: {
      id: true,
      collectionId: true,
      isActive: true,
      previewToken: true,
    },
  });
  const campaignIds = campaigns.map((campaign) => campaign.collectionId);

  const listing: PublicationCollectionListing = collections.map(
    ({ node: collection }) => ({
      id: collection.id,
      isCampaign: campaignIds.includes(collection.id),
      isActive:
        campaigns.find((campaign) => campaign.collectionId === collection.id)
          ?.isActive ?? false,
      handle: collection.handle,
      title: collection.title,
      productCount: collection.productsCount,
      previewToken:
        campaigns.find((campaign) => campaign.collectionId === collection.id)
          ?.previewToken ?? "",
    })
  );

  return res.status(200).json({ id: publication.id, listing });
});

export default router.handler();
