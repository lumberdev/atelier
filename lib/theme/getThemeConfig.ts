import prisma from "@/utils/prisma";
import { RestClient } from "@shopify/shopify-api/lib/clients/rest/rest_client";
import { getCampaignTheme } from "./getCampaignThemeConfig";

const getThemeConfig = async ({
  shop,
  handle,
  restClient,
}: {
  shop: string;
  handle: string;
  restClient: RestClient;
}) => {
  const merchantSettings = await getCampaignTheme({ client: restClient });

  const merchant = await prisma.stores.findUnique({
    where: { shop },
    select: {
      theme: {
        select: {
          logo: true,
          logoPosition: true,
          primaryColor: true,
          secondaryColor: true,
          backgroundColor: true,
          borderRadius: true,
          favicon: true,
        },
      },
      campaigns: {
        where: { handle },
        select: {
          announcement: true,
          cartBackgroundColor: true,
          cartCheckoutButtonStyle: true,
          cartItemsImageStyle: true,
          cartTextColor: true,
          cartTitle: true,
          cartDescription: true,
          accessPageConfig: {
            select: {
              layout: true,
              headline: true,
              body: true,
              passwordPlaceholder: true,
              ctaText: true,
              ctaUrl: true,
              backgroundColor: true,
              backgroundImage: true,
            },
          },
        },
      },
    },
  });

  const {
    current: { favicon, colors_accent_1, colors_accent_2, colors_background_1 },
  } = merchantSettings;
  const { theme, campaigns } = merchant;
  const [campaign] = campaigns;

  return {
    theme: {
      favicon,
      primaryColor: colors_accent_1,
      secondaryColor: colors_accent_2,
      backgroundColor: colors_background_1,
    },
    global: theme,
    announcement: campaign.announcement,
    cart: {
      backgroundColor: campaign.cartBackgroundColor,
      checkoutButtonStyle: campaign.cartCheckoutButtonStyle,
      lineItemImageStyle: campaign.cartItemsImageStyle,
      textColor: campaign.cartTextColor,
      title: campaign.cartTitle,
      description: campaign.cartDescription,
    },
    accessPage: campaign.accessPageConfig,
  };
};

export default getThemeConfig;
