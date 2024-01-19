import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
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

  const { client: restClient } = await clientProvider.offline.restClient({
    shop,
  });

  const response = await graphqlClient.query({
    data: `
      query ShopQuery {
        shop {
          id
          myshopifyDomain
          storefrontAccessTokens(first: 10) {
            edges {
              node {
                accessToken
              }
            }
          }
        }

        currentAppInstallation {
          app {
            handle
          }

          publication {
            id
          }
        }
      }
    `,
  });

  const data = (response.body as any)?.data ?? null;
  const id = data.shop.id;
  const domain = data.shop.myshopifyDomain;
  const appHandle = data.currentAppInstallation.app.handle;
  const publicationId = data.currentAppInstallation.publication?.id ?? "";

  const listingResponse = await restClient.get({
    path: "product_listings/count",
  });
  const availableProductCount = (listingResponse.body as any)?.count ?? 0;

  return res
    .status(200)
    .json({ id, domain, appHandle, publicationId, availableProductCount });
});

export default router.handler();
