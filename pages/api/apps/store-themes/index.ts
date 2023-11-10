import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "@shopify/shopify-api";
import verifyRequest from "@/utils/middleware/verifyRequest";
import { StoreThemeInput } from "@/lib/types";
import prisma from "@/utils/prisma";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.get(async (req, res) => {
  const shop = req.user_session.shop;

  const store = await prisma.stores.findUnique({
    where: { shop },
    include: { theme: true },
  });

  if (!store)
    return res.status(500).json({
      error: {
        code: "UNABLE_TO_FIND_STORE",
        message: "Unable to fund a store with the provided name",
      },
    });

  return res.status(200).json({ theme: store?.theme });
});

router.post(async (req, res) => {
  const shop = req.user_session.shop;
  const body = JSON.parse(req.body) as StoreThemeInput;

  const store = await prisma.stores.findUnique({
    where: { shop },
    include: { theme: true },
  });
  const theme = store.theme;

  const updatedTheme = await prisma.storeThemes.update({
    where: { id: theme.id },
    data: { ...body },
  });

  return res.status(200).json({ theme: updatedTheme });
});

export default router.handler();
