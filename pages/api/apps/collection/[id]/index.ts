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
  const collectionId = req.query.id;

  console.log("[AT]");

  const { client } = await clientProvider.offline.graphqlClient({ shop });

  const response = await client.query({
    data: `
      query Collection {
        collection(id: "gid://shopify/Collection/${collectionId}") {
          id
          handle
          title
          description
          descriptionHtml
          image {
            id
            width
            height
            altText
            url
          }
        }
      }
    `,
  });

  const collection = (response.body as any).data?.collection;

  return res.status(200).json(collection);
});

export default router.handler();
