import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
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

  const merchant = await prisma.stores.findUnique({
    where: { identifier: subdomain },
    include: {
      theme: true,
    },
  });

  const theme = merchant.theme ?? {};

  return res.status(200).json({ global: theme });
});

export default router.handler();
