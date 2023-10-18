import { gql } from "graphql-request";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import sessionHandler from "@/utils/sessionHandler.js";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

const PRODUCT_QUERY_BY_ID = gql`
  query Product($productId: ID!) {
    product(id: $productId) {
      id
      title
      description
      options {
        id
        name
        values
      }
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
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            title
            id
            inventoryQuantity
            availableForSale
            compareAtPrice
            price
            selectedOptions {
              name
              value
            }
            product {
              id
            }
          }
        }
      }
    }
  }
`;

router.get(async (req, res) => {
  const storeId = req.query.store_id as string;
  const productId = req.query.product_id as string;
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
      query: PRODUCT_QUERY_BY_ID,
      variables: {
        productId: `gid://shopify/Product/${productId}`,
      },
    }),
  };

  try {
    const raw = await fetch(shopifyStoreUrl, options).then((response) =>
      response.json()
    );
    res.status(200).json({ product: raw.data.product });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
