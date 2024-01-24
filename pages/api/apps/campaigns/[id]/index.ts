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

  // GET COLLECTIONS
  const { client: graphqlClient } = await clientProvider.offline.graphqlClient({
    shop: req.user_session.shop,
  });

  const queryPromises = campaign.collectionIds.map((id) =>
    graphqlClient.query<{ data: { collection: any | null } }>({
      data: `{
      collection(id: "${id}") {
        id
        handle
        title
        image {
          src: url
        }
        productsCount
      }
    }`,
    })
  );

  const collectionsResponse = await Promise.all(queryPromises);
  const collections = collectionsResponse
    .map((response) => response.body.data?.collection)
    .filter(Boolean);

  // GET PRODUCTS

  const ids = campaign.productIds
    .map((gid) => {
      const [id] = gid.split("/").reverse();
      return id;
    })
    .join(",");

  const { client: restClient } = await clientProvider.offline.restClient({
    shop: req.user_session.shop,
  });

  const productsResponse = await restClient.get<{
    products: any[];
  }>({ path: `/products.json?ids=${ids}` });

  const products = productsResponse.body.products.map((product) => ({
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

  return res.status(200).json({ campaign, products, collections });
});

router.post(async (req, res) => {
  const shop = req.user_session.shop;
  const id = req.query.id as string;
  const { status } = JSON.parse(req.body);

  const campaign = await prisma.campaigns.update({
    where: {
      id,
      store: {
        shop,
      },
    },
    data: {
      isActive: status,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  return res.status(200).json({ campaign });
});

export default router.handler();
