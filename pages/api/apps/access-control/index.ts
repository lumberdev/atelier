import { AccessPageConfigInput } from "@/lib/types";
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
  const body = JSON.parse(req.body) as AccessPageConfigInput;

  const { id, campaignId, ...fields } = body;

  const config = await prisma.accessPageConfig.upsert({
    where: { campaign: { store: { shop } }, id: id ?? "" },
    create: {
      campaign: {
        connect: {
          id: campaignId,
        },
      },
      ...fields,
    },
    update: {
      ...fields,
    },
  });

  return res.status(200).json({ config });
});

export default router.handler();
