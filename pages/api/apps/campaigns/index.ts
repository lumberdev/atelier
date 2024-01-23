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
  const body = JSON.parse(req.body) as CampaignInput & {
    handle: string;
    collectionId: string;
  };

  const campaign = await prisma.campaigns.upsert({
    where: { id: body.id ?? "" },
    create: {
      handle: body.handle ?? "",
      collectionId: body.collectionId ?? "",
      isActive: body.isActive ?? false,
      announcement: body.announcement ?? "",
      cartTitle: body.cartTitle ?? "",
      cartItemsImageStyle: body.cartItemsImageStyle ?? "",
      cartDescription: body.cartDescription ?? "",
      cartCheckoutButtonStyle: body.cartCheckoutButtonStyle ?? "",
      cartBackgroundColor: body.cartBackgroundColor ?? "",
      cartTextColor: body.cartTextColor ?? "",
      accessPageConfig: {
        create: {
          layout: body.acpLayout ?? "",
          headline: body.acpHeadline ?? "",
          body: body.acpBody ?? "",
          password: body.acpPassword ?? "",
          passwordPlaceholder: body.acpPasswordPlaceholder ?? "",
          ctaText: body.acpCTAText ?? "",
          ctaUrl: body.acpCTAUrl ?? "",
          backgroundColor: body.acpBackgroundColor ?? "",
          backgroundImage: body.acpBackgroundImage ?? "",
        },
      },
      store: {
        connect: {
          shop,
        },
      },
    },
    update: {
      isActive: body.isActive ?? false,
      announcement: body.announcement ?? "",
      cartTitle: body.cartTitle ?? "",
      cartItemsImageStyle: body.cartItemsImageStyle ?? "",
      cartDescription: body.cartDescription ?? "",
      cartCheckoutButtonStyle: body.cartCheckoutButtonStyle ?? "",
      cartBackgroundColor: body.cartBackgroundColor ?? "",
      cartTextColor: body.cartTextColor ?? "",
      accessPageConfig: {
        update: {
          layout: body.acpLayout ?? "",
          headline: body.acpHeadline ?? "",
          body: body.acpBody ?? "",
          password: body.acpPassword ?? "",
          passwordPlaceholder: body.acpPasswordPlaceholder ?? "",
          ctaText: body.acpCTAText ?? "",
          ctaUrl: body.acpCTAUrl ?? "",
          backgroundColor: body.acpBackgroundColor ?? "",
          backgroundImage: body.acpBackgroundImage ?? "",
        },
      },
    },
  });

  return res.status(200).json({ campaign });
});

export default router.handler();
