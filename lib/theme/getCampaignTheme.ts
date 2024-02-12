import clientProvider from "@/utils/clientProvider";
import { CampaignTheme } from "../types";

const getCampaignTheme = async ({
  shop
}: {
  shop: string;
}) => {
    const { client } = await clientProvider.offline.restClient({ shop });

    const response = await client.get({ path: `themes`});
    const themes = response.body["themes"];
    const theme_id = themes.find((theme: CampaignTheme) => theme.role === "main")?.id;
    // assume everything is here for now
    const demoAsset = await client.get({ path: `themes/${theme_id}/assets.json?asset[key]=config/settings_data.json` });
    console.log("everything is the main theme here", JSON.parse(demoAsset.body['asset'].value));

    return themes;
};

export default getCampaignTheme;
