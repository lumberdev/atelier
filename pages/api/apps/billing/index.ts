import { ShopifyRecurringAppSubscription } from "@/lib/types";
import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
import {
  ActiveSubscriptions,
  CurrentAppInstallation,
  CurrentAppInstallations,
  Session,
} from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.get(async (req, res) => {
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
          name
          status
          currentPeriodEnd
          lineItems {
            plan {
              pricingDetails {
                ... on AppRecurringPricing {
                  __typename
                  price {
                    amount
                    currencyCode
                  }
                  interval
                }
              }
            }
          }
          test
        }
      }
    }`,
  });

  return res.status(200).json({
    subscriptions: response.body.data.appInstallation.activeSubscriptions,
  });
});

const SUBSCRIPTION_PLAN = {
  STARTER: {
    name: "Starter",
    price: 49.0,
  },
  PREMIUM: {
    name: "Premium",
    price: 99.0,
  },
};

router.post(async (req, res) => {
  const shop = req.user_session.shop;
  const { plan: planHandle } = JSON.parse(req.body);
  const plan = SUBSCRIPTION_PLAN[planHandle];

  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });

  const response = await client.query<{ data: { appSubscriptionCreate: any } }>(
    {
      data: `mutation CreateSubscription{
    appSubscriptionCreate(
      name: "${plan.name}"
      returnUrl: "${process.env.SHOPIFY_APP_URL}/api/auth?shop=${shop}",
      test: true,
      trialDays: 56,
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: ${plan.price}, currencyCode: USD }
            }
          }
        }
      ]
    ) {
      userErrors {
        field
        message
      }
      confirmationUrl
      appSubscription {
        id
        status
      }
    }
  }
`,
    }
  );

  const data = response.body.data.appSubscriptionCreate;

  if (data.userErrors.length) {
    console.log(
      `[AT] ERROR WHILE SUBSCRIBING TO PLAN ${planHandle}`,
      JSON.stringify(data.userErrors)
    );

    return res.status(400).json({
      error: { message: "UNABLE_TO_SUBSCRIBE", data: data.userErrors },
    });
  }

  return res.status(200).json({ confirmationUrl: data.confirmationUrl });
});

export default router.handler();
