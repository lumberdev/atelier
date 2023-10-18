import { gql } from "graphql-request";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import sessionHandler from "@/utils/sessionHandler.js";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

const CHECKOUT_QUERY = gql`
  mutation {
    checkoutCreate(
      input: {
        lineItems: [
          {
            variantId: "gid://shopify/ProductVariant/44380869361910"
            quantity: 1
          }
        ]
      }
    ) {
      checkout {
        id
        webUrl
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
`;

router.get(async (req, res) => {
  const storeId = req.query.store_id as string;
  // const variantIds = req.query.variant_ids as string;
  // console.log(req.query);

  const shopifyStore = "river-theme";
  const shopifyStoreUrl = `https://${shopifyStore}.myshopify.com/api/2023-10/graphql.json`;

  const session = await sessionHandler.loadSession(`offline_${storeId}`);
  const accessToken = session.accessToken;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query: CHECKOUT_QUERY,
    }),
  };

  try {
    const response = await fetch(shopifyStoreUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const raw = await response.json();
    console.log(raw);

    res.status(200).json({ checkout: raw });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
