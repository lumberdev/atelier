import { CampaignInput } from "@/lib/types";
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

  const store = await prisma.stores.findUnique({ where: { shop } });

  if (!store)
    return res.status(500).json({
      error: {
        code: "UNABLE_TO_FIND_STORE",
        message: "Unable to find a store with the provided name",
      },
    });

  return res.status(200).json({ identifier: store?.identifier, campaigns: [] });
});

router.post(async (req, res) => {
  const shop = req.user_session.shop;
  const body = JSON.parse(req.body) as CampaignInput;

  const campaign = await prisma.campaigns.upsert({
    where: { id: body.id ?? "" },
    create: {
      title: body.title,
      handle: body.handle,
      description: body.description,
      resourceType: body.resourceType,
      resourceIds: body.resourceIds,
      variantIds: body.variantIds,
      image: body.image,
      isActive: body.isActive,
      store: {
        connect: {
          shop,
        },
      },
    },
    update: {
      title: body.title,
      handle: body.handle,
      description: body.description,
      resourceType: body.resourceType,
      resourceIds: body.resourceIds,
      variantIds: body.variantIds,
      image: body.image,
      isActive: body.isActive,
    },
  });

  return res.status(200).json({ campaign });
});

export default router.handler();
