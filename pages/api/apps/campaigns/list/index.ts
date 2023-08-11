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
  const shop = req.user_session.shop;

  const store = await prisma.stores.findUnique({
    where: { shop },
    include: { campaigns: true },
  });

  if (!store)
    return res.status(500).json({
      error: {
        code: "UNABLE_TO_FIND_STORE",
        message: "Unable to find a store with the provided name",
      },
    });

  return res
    .status(200)
    .json({ identifier: store?.identifier, campaigns: store.campaigns });
});

export default router.handler();
