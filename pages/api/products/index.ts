import { gql } from "graphql-request";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import sessionHandler from "@/utils/sessionHandler.js";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

const PRODUCTS_QUERY_BY_IDS = gql`
  query Products($ids: [ID!]!) {
    products(ids: $ids) {
      edges {
        node {
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
      }
    }
  }
`;

const PRODUCTS_QUERY_ALL = gql`
  query Products {
    products(first: 100) {
      edges {
        node {
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
      }
    }
  }
`;

router.get(async (req, res) => {
  const storeId = req.query.store_id as string;
  const productIds = req.query.product_ids as string[];

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
      query:
        Array.isArray(productIds) && productIds.length > 0
          ? PRODUCTS_QUERY_BY_IDS
          : PRODUCTS_QUERY_ALL,
      variables: { ids: productIds },
    }),
  };

  try {
    const raw = await fetch(shopifyStoreUrl, options).then((response) =>
      response.json()
    );
    res.status(200).json({ products: raw.data.products.edges });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
