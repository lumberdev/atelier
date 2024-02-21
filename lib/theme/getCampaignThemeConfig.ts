import { ShopifyMerchantTheme, ShopifyThemeSettingsConfig } from "../types";
import { RestClient } from "@shopify/shopify-api/lib/clients/rest/rest_client";

export const getCampaignTheme = async ({
  client,
}: {
  client: RestClient;
}) => {
  const response = await client.get<{
    themes: ShopifyMerchantTheme[];
  }>({ path: `themes` });
  const themes = response.body["themes"];
  const theme_id = themes.find((theme) => theme.role === "main")?.id;

  // Retrieve theme settings file from the theme code
  const config_json: ShopifyThemeSettingsConfig = await client
    .get({
      path: `themes/${theme_id}/assets.json?asset[key]=config/settings_data.json`,
    })
    .then((resp) => JSON.parse(resp.body["asset"]?.value));

  return config_json;
};
