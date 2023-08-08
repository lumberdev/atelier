import { CampaignInput } from "@/lib/types";
import prisma from "@/utils/prisma";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.put(async (req, res) => {
  const { ids, input } = JSON.parse(req.body) as {
    ids: string[];
    input: CampaignInput;
  };

  const response = await prisma.campaigns.updateMany({
    where: {
      id: { in: ids },
    },
    data: input,
  });

  return res.status(200).json(response);
});

router.delete(async (req, res) => {
  const { ids } = JSON.parse(req.body) as { ids: string[] };

  const response = await prisma.campaigns.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  return res.status(200).json(response);
});

export default router.handler();
