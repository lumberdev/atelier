import prisma from "@/utils/prisma";
import { RestClient } from "@shopify/shopify-api/lib/clients/rest/rest_client";
import { getCampaignTheme } from "./getCampaignThemeConfig";
import { supabaseStorage } from "@/utils/supabase";

const getThemeConfig = async ({
  shop,
  handle,
  restClient,
}: {
  shop: string;
  handle: string;
  restClient: RestClient;
}) => {
  const merchantSettingsPromise = getCampaignTheme({ client: restClient });

  const merchantPromise = prisma.stores.findUnique({
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

  const [merchantSettings, merchant] = await Promise.all([
    merchantSettingsPromise,
    merchantPromise,
  ]);

  const {
    current: {
      favicon,
      colors_accent_1,
      colors_accent_2,
      colors_background_1,
      buttons_radius,
      colors_text,
    },
  } = merchantSettings;
  const { theme, campaigns } = merchant;
  const [campaign] = campaigns;

  const campaignFaviconUrl = theme.favicon
    ? supabaseStorage.getPublicUrl(favicon).data.publicUrl
    : "";
  const themeFaviconUrl = favicon
    ? `https://${shop}/cdn/shop/files/${favicon.split("/").reverse()[0]}`
    : "";

  const campaignLogo = theme.logo
    ? supabaseStorage.getPublicUrl(theme.logo).data.publicUrl
    : "";

  return {
    global: {
      ...theme,
      favicon: campaignFaviconUrl ? campaignFaviconUrl : themeFaviconUrl,
      logo: campaignLogo,
      primaryColor: theme.primaryColor ? theme.primaryColor : colors_accent_1,
      secondaryColor: theme.secondaryColor
        ? theme.secondaryColor
        : colors_accent_2,
      backgroundColor: theme.backgroundColor
        ? theme.backgroundColor
        : colors_background_1,
      borderRadius: theme.borderRadius ?? buttons_radius,
      textColor: colors_text,
    },
    announcement: campaign.announcement,
    cart: {
      backgroundColor: campaign.cartBackgroundColor,
      checkoutButtonStyle: campaign.cartCheckoutButtonStyle,
      lineItemImageStyle: campaign.cartItemsImageStyle,
      textColor: campaign.cartTextColor,
      title: campaign.cartTitle,
      description: campaign.cartDescription,
    },
    accessPage: {
      ...campaign.accessPageConfig,
      backgroundImage: campaign.accessPageConfig.backgroundImage
        ? supabaseStorage.getPublicUrl(
            campaign.accessPageConfig.backgroundImage
          ).data.publicUrl
        : "",
    },
  };
};

export default getThemeConfig;
