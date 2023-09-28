import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import prisma from "@/utils/prisma";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.get(async (req, res) => {
  const campaignHandle = req.query.handle as string;
  const subdomain = "river";

  const store = await prisma.stores.findUnique({
    where: { identifier: subdomain },
    include: {
      campaigns: {
        where: {
          handle: campaignHandle,
        },
      },
    },
  });

  try {
    res.status(200).json({ campaign: store?.campaigns[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
