import { CampaignProduct } from "@/lib/types";
import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.post(async (req, res) => {
    const { client } = await clientProvider.graphqlClient({ req, res, isOnline: true });

    const shop = req.user_session.shop;
    const { id } = req.query;

    console.log("router post", id, shop, req.body);

    return res.status(200).send("Hello World");
});


export default router.handler();