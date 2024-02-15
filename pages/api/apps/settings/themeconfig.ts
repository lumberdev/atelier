import verifyRequest from "@/utils/middleware/verifyRequest";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import prisma from "@/utils/prisma";
import clientProvider from "@/utils/clientProvider";
import { getCampaignTheme } from "@/lib/theme/getCampaignThemeConfig";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.get(async (req, res) => {
    const shop = req.user_session.shop;

    const storeTheme = await prisma.storeThemes.findUnique({ where: { storeId: shop } });

    if (!storeTheme)
        return res.status(500).json({
        error: {
            code: "UNABLE_TO_FIND_STORE",
            message: "Unable to find a store with the provided name",
        },
    });

    const { client } = await clientProvider.restClient({ req, res, isOnline: true });
    const theme_config = await getCampaignTheme({ shop, client });

    const updatedStore = await prisma.storeThemes.update({
        where: { storeId: shop },
        data: {
            primaryColor: storeTheme.primaryColor === null ? theme_config["current"]?.colors_accent_1 : storeTheme.primaryColor,
            secondaryColor: storeTheme.secondaryColor === null ? theme_config["current"]?.colors_accent_2 : storeTheme.secondaryColor,
            backgroundColor: storeTheme.backgroundColor === null ? theme_config["current"]?.colors_background_1 : storeTheme.backgroundColor
        }
    })


    res.status(200).json({ theme: updatedStore });
});

export default router.handler();