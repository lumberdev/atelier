import { CampaignProduct } from "@/lib/types";
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

router.post(async (req, res) => {
    const { client } = await clientProvider.graphqlClient({ req, res, isOnline: true });

    const shop = req.user_session.shop;
    const { id } = req.query;

    const prodId = `gid://shopify/Product/${id}`;
    const body = JSON.parse(req.body);
    const tags = body?.data;

    const data = await client.query({
      data: `
        mutation {
          productUpdate(input: { id: "${prodId}", tags: "${tags.join(", ")}" }) {
            product { 
              id 
              title
              description
              descriptionHtml
              tags
              priceRangeV2 {
                minVariantPrice {
                  amount
                }
                maxVariantPrice {
                  amount
                }
              }
            }
          }
        }
      `
    });

    const product: CampaignProduct = (data as any).body.data?.productUpdate;

    return res.status(200).json(product);
});


export default router.handler();