import getMerchantTheme from "@/lib/merchant/getMerchantTheme";
import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { url, subdomain } = getServerSideRequestUrl(req);

  if (!subdomain)
    return res
      .status(404)
      .json({ error: { code: "NOT_FOUND", message: "Store not found." } });

  const theme = await getMerchantTheme(subdomain);

  return res.status(200).json({ global: theme });
});

export default router.handler();
