import { gql } from "graphql-request";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import sessionHandler from "@/utils/sessionHandler.js";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

const getProductsQuery = (productIds) => gql`
  query Products {
    ${productIds
      .map(
        (id, index) => `
        product${index + 1}: node(id: "${id}") {
          ... on Product {
            id
            title
            updatedAt
            handle
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }`
      )
      .join("\n")}
  }
`;

router.get(async (req, res) => {
  const storeId = req.query.store_id as string;
  const productIdsString = req.query.product_ids as string;
  const productIds = productIdsString.split(",");

  const shopifyStore = "river-theme";
  const shopifyStoreUrl = `https://${shopifyStore}.myshopify.com/admin/api/2023-04/graphql.json`;

  const session = await sessionHandler.loadSession(`offline_${storeId}`);
  const accessToken = session.accessToken;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query: getProductsQuery(productIds),
    }),
  };

  try {
    const raw = await fetch(shopifyStoreUrl, options).then((response) =>
      response.json()
    );
    const products = Object.values(raw.data);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
