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

  res.status(200).json({ settings: { domain: store.identifier } });
});

router.put(async (req, res) => {
  const shop = req.user_session.shop;
  const { domain } = JSON.parse(req.body) as { domain: string };

  const matchingDomainStore = await prisma.stores.findUnique({
    where: { identifier: domain },
  });

  if (matchingDomainStore)
    return res.status(409).json({
      error: {
        code: "UNAVAILABLE_DOMAIN",
        message: "The domain is already taken.",
      },
    });

  const store = await prisma.stores.findUnique({ where: { shop } });

  if (!store)
    return res.status(500).json({
      error: {
        code: "UNABLE_TO_FIND_STORE",
        message: "Unable to find a store with the provided name",
      },
    });

  const updatedStore = await prisma.stores.update({
    where: { shop },
    data: { identifier: domain },
  });

  return res
    .status(200)
    .json({ settings: { domain: updatedStore.identifier } });
});

export default router.handler();
