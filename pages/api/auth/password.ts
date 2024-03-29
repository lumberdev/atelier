import { getAuthorizationToken } from "@/lib/auth/getAuthorizationToken";
import { verifyAuthorizationToken } from "@/lib/auth/verifyAuthorizationToken";
import prisma from "@/utils/prisma";
import { Session } from "@shopify/shopify-api";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { NextResponse } from "next/server";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.post(async (req, res) => {
  const { campaign: campaignHandle, password } = req.body as {
    campaign: string;
    password: string;
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
  const token = getAuthorizationToken({
    merchantSecret: store.secret,
    campaignPassword: password,
  });

  const authorized = verifyAuthorizationToken({
    token,
    merchantSecret: store.secret,
    campaignPassword: accessPageConfig.password,
  });

  if (!authorized)
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "Invalid password." } });

  // TODO: Make this cookie secure
  const cookie = serialize("auth_token", token, { httpOnly: false, path: "/" });

  res.setHeader("Set-Cookie", cookie);

  return res.status(200).json({ success: true });
});

export default router.handler();
