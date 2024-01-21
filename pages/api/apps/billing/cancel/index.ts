import { ShopifyRecurringAppSubscription } from "@/lib/types";
import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
import { ActiveSubscriptions, Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.post(async (req, res) => {
  const shop = req.user_session.shop;

  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  const response = await client.query<{
    data: {
      appInstallation: {
        activeSubscriptions: ShopifyRecurringAppSubscription[];
      };
    };
  }>({
    data: `{
      appInstallation {
        activeSubscriptions {
          id
          name
          status
        }
      }
    }`,
  });

  const subscriptions =
    response.body.data.appInstallation.activeSubscriptions ?? [];

  const activeSubscription = subscriptions.find(
    (subscription) => subscription.status === "ACTIVE"
  );

  if (!activeSubscription?.id)
    return res
      .status(400)
      .json({ error: { message: "No active subscription" } });

  const cancelResponse = await client.query<{
    data: { appSubscriptionCancel: any };
  }>({
    data: `mutation CancelSubscription {
      appSubscriptionCancel(id: "${activeSubscription.id}") {
        appSubscription {
          id
          name
          status
        },
        userErrors {
          field
          message
        }
      }
    }`,
  });

  const data = cancelResponse.body.data.appSubscriptionCancel;

  if (data.userErrors.length) {
    console.log(
      `[AT] ERROR WHILE CANCELLING SUBSCRIPTION ${activeSubscription.id}`,
      JSON.stringify(data.userErrors)
    );
  }

  return res.status(200).json({ subscription: data.appSubscription });
});

export default router.handler();
