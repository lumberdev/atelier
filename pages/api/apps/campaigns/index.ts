import { CampaignInput, CampaignQueryFields } from "@/lib/types";
import flattenCampaignFields from "@/utils/flattenCampaignFields";
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
  const body = JSON.parse(req.body) as CampaignInput & {
    handle: string;
    collectionId: string;
  };

  const campaign: CampaignQueryFields = await prisma.campaigns.upsert({
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
    include: {
      accessPageConfig: true,
    },
  });

  const fields = flattenCampaignFields(campaign);

  return res.status(200).json({ campaign: fields });
});

export default router.handler();
