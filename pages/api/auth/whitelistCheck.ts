import { getAuthorizationToken } from "@/lib/auth/getAuthorizationToken";
import { verifyAuthorizationToken } from "@/lib/auth/verifyAuthorizationToken";
import prisma from "@/utils/prisma";
import { Session } from "@shopify/shopify-api";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { NextResponse } from "next/server";
import { supabaseStorage } from "@/utils/supabase";
import { isWhiteListed } from "@/utils/checkWhitelistedEmails";
import { stytch } from "@/lib/auth/authorizeStytchToken";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.post(async (req, res) => {
  const { campaign: campaignHandle, email } = req.body as {
    campaign: string;
    email: string;
  };

  const url = new URL(
    req.url,
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      req.headers.host
    }`
  );
  const [subdomain] = url.hostname.split(".");

  if (["localhost", "atelier"].includes(subdomain))
    return res
      .status(404)
      .json({ error: { code: "NOT_FOUND", message: "Store not found." } });

  const store = await prisma.stores.findUnique({
    where: { identifier: subdomain },
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
  const csvFile = supabaseStorage.getPublicUrl(accessPageConfig.csvFile).data
    .publicUrl;

  const isWhitelistedEmail = await isWhiteListed(email, csvFile);
  const redirectUrl = `http://localhost:3000/authenticate?store=${subdomain}&campaign=${campaignHandle}`;

  // If the email is whitelisted, send out magic link
  // If not, handle signup
  if (isWhitelistedEmail) {
    const params = {
      email: "ghpratik1@gmail.com",
      login_magic_link_url: redirectUrl,
      signup_magic_link_url: redirectUrl,
    };

    const response = await stytch.magicLinks.email.loginOrCreate(params);
  } else {
    // handle sign up
  }

  return res.status(200).json({ success: true });
});

export default router.handler();
