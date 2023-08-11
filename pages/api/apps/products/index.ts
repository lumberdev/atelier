import { gql } from "graphql-request";
import verifyRequest from "@/utils/middleware/verifyRequest";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

const PRODUCTS_QUERY = gql`
  query Products {
    products(first: 100) {
      edges {
        node {
          id
          updatedAt
          handle
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
  const shopifyStore = "river-theme";
  const shopifyStoreUrl = `https://${shopifyStore}.myshopify.com/admin/api/2023-04/graphql.json`;
  const accessToken = req.user_session.accessToken;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
  };

  try {
    const raw = await fetch(shopifyStoreUrl, options).then((response) =>
      response.json()
    );
    res
      .status(200)
      .json({ identifier: "id", products: raw.data.products.edges });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
