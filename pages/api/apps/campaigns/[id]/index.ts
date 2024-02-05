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
