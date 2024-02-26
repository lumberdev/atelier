import { stytch } from "@/lib/auth/authorizeStytchToken";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { Session } from "@shopify/shopify-api";
import { getAuthorizationToken } from "@/lib/auth/getAuthorizationToken";
import prisma from "@/utils/prisma";
import { serialize } from "cookie";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.post(async (req, res) => {
  const { token, campaignHandle, storeId } = req.body as {
    token: string;
    campaignHandle: string;
    storeId: string;
  };
  try {
    // 1. Validate token with Stytch
    const response = await stytch.magicLinks.authenticate({ token });

    // 2. Create Auth token and set cookie
    if (response?.status_code !== 200) return null;
    const store = await prisma.stores.findUnique({
      where: { identifier: storeId },
      include: {
        campaigns: {
          where: {
            handle: campaignHandle,
          },
          include: {
            accessPageConfig: true,
          },
        },
      },
    });
    const [{ accessPageConfig, ...campaign }] = store.campaigns ?? [];

    const authToken = getAuthorizationToken({
      merchantSecret: store.secret,
      campaignPassword: accessPageConfig.password,
    });

    // TODO: Make this cookie secure
    const cookie = serialize("auth_token", authToken, {
      httpOnly: false,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    // 3. Redirect to campaign page
    const isProd = process.env.NODE_ENV === "production";
    const redirectUrl = `${isProd ? "https" : "http"}://${storeId}.${isProd ? "atelier.sale" : "localhost:3000"}/${campaignHandle}`;
    return res.status(200).json({ redirectUrl });
    // res.redirect(307, redirectUrl);
  } catch (e) {
    const errorString = JSON.stringify(e);
    return res.status(404).json({ errorString });
  }
});
export default router.handler();
