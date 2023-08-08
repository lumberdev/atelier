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
  const id = req.query.id as string;

  const campaign = await prisma.campaigns.findUnique({
    where: { id },
  });

  const resourceType = campaign.resourceType;

  const { client } = await clientProvider.offline.restClient({
    shop: req.user_session.shop,
  });

  const ids = campaign.resourceIds
    .map((gid) => {
      const [id] = gid.split("/").reverse();
      return id;
    })
    .join(",");

  const response = await client.get<{ collections: any[]; products: any[] }>({
    path: `/${
      resourceType === "COLLECTIONS" ? "custom_collections" : "products"
    }.json?ids=${ids}`,
  });

  const resources =
    resourceType === "COLLECTIONS"
      ? response.body.collections.map((collection) => ({
          ...collection,
          id: `gid://shopify/Collection/${collection.id}`,
        }))
      : response.body.products.map((product) => ({
          ...product,
          id: `gid://shopify/Product/${product.id}`,
          variants: [
            ...product.variants
              .map((variant) => ({
                ...variant,
                id: `gid://shopify/ProductVariant/${variant.id}`,
              }))
              .filter((variant) => campaign.variantIds.includes(variant.id)),
          ],
        }));

  return res.status(200).json({ campaign, resources: resources });
});

export default router.handler();
