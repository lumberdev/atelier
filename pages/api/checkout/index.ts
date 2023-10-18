import { gql } from "graphql-request";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import sessionHandler from "@/utils/sessionHandler.js";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.get(async (req, res) => {
  const storeId = req.query.store_id as string;
  const lineItems = req.query.line_items as string;

  const shopifyStore = "river-theme";
  const shopifyStoreUrl = `https://${shopifyStore}.myshopify.com/admin/api/2023-01/checkouts.json`;

  const session = await sessionHandler.loadSession(`offline_${storeId}`);
  const accessToken = session.accessToken;

  const data = {
    checkout: {
      line_items: JSON.parse(lineItems),
    },
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(shopifyStoreUrl, options);
    const raw = await response.json();
    console.log(raw);

    res.status(200).json({ checkout: raw });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
