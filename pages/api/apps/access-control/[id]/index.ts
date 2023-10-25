import verifyRequest from "@/utils/middleware/verifyRequest";
import prisma from "@/utils/prisma";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest & { user_session: Session }, NextApiResponse>();

router.use(verifyRequest);

router.get(async (req, res) => {
  const id = req.query.id as string;

  const config = await prisma.accessPageConfig.findUnique({
    where: { campaignId: id },
  });

  return res.status(200).json({ config });
});

export default router.handler();
