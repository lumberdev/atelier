import clientProvider from "@/utils/clientProvider";
import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { url, subdomain } = getServerSideRequestUrl(req);

  const merchant = await prisma.stores.findUnique({
    where: { identifier: subdomain },
    select: { shop: true },
  });

  if (!merchant)
    return res.status(404).json({
      error: {
        code: "STORE_NOT_FOUND",
        message: "Merchant for requested subdomain does not exist.",
      },
    });

  const { client } = await clientProvider.offline.graphqlClient({
    shop: merchant.shop,
  });

  const response = await client.query<{
    data: {
      shop: {
        storefrontAccessTokens?: {
          nodes: {
            accessToken: string;
          }[];
        };
      };
    };
  }>({
    data: `
      query Shop {
        shop {
          storefrontAccessTokens(first: 1) {
            nodes {
              id
              accessToken
            }
          }
        }
      }
    `,
  });

  const [token] = response.body.data.shop.storefrontAccessTokens?.nodes ?? [];

  return res.status(200).json({
    domain: merchant.shop,
    storefrontAccessToken: token?.accessToken,
  });
});

export default router.handler();
