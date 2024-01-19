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

  const availableProductCount = store.campaigns.reduce(
    (acc, campaign) => acc + campaign.productIds.length,
    0
  );

  return res.status(200).json({
    identifier: store?.identifier,
    campaigns: store.campaigns,
    availableProductCount,
  });
});

router.post(async (req, res) => {
  const shop = req.user_session.shop;
  const body = JSON.parse(req.body) as CampaignInput;

  const campaign = await prisma.campaigns.upsert({
    where: { id: body.id ?? "" },
    create: {
      title: body.title ?? "",
      handle: body.handle ?? "",
      description: body.description ?? "",
      announcement: body.announcement ?? "",
      collectionIds: body.collectionIds ?? [],
      productIds: body.productIds ?? [],
      variantIds: body.variantIds ?? [],
      image: body.image ?? "",
      isActive: body.isActive ?? false,
      cartTitle: body.cartTitle ?? "",
      cartDescription: body.cartDescription ?? "",
      cartItemsImageStyle: body.cartItemsImageStyle ?? "",
      cartCheckoutButtonStyle: body.cartCheckoutButtonStyle ?? "",
      cartBackgroundColor: body.cartBackgroundColor ?? "",
      cartTextColor: body.cartTextColor ?? "",
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
      announcement: body.announcement,
      collectionIds: body.collectionIds,
      productIds: body.productIds,
      variantIds: body.variantIds,
      image: body.image,
      isActive: body.isActive,
      cartTitle: body.cartTitle,
      cartDescription: body.cartDescription,
      cartItemsImageStyle: body.cartItemsImageStyle,
      cartCheckoutButtonStyle: body.cartCheckoutButtonStyle,
      cartBackgroundColor: body.cartBackgroundColor,
      cartTextColor: body.cartTextColor,
    },
  });

  return res.status(200).json({ campaign });
});

export default router.handler();
