// To create a new webhook, create a new `.js` folder in /utils/webhooks/ and use the project snippet
// `createwebhook` to generate webhook boilerplate

/**
 * @typedef { import("@/_developer/types/2023-07/webhooks.js").APP_UNINSTALLED} AppUninstalled
 */

import prisma from "@/utils/prisma.js";


const appUninstallHandler = async (topic, shop, webhookRequestBody) => {
  try {

    /** @type {AppUninstalled} */
    const webhookBody = JSON.parse(webhookRequestBody);
    await prisma.session.deleteMany({ where: { shop } });

    const deleteCampaigns = await prisma.campaigns.deleteMany({
      where: {
        storeId: shop
      }
    });

    console.log("delete campaign done", deleteCampaigns);

    const deleteStoreTheme = await prisma.storeThemes.delete({
      where: { storeId: shop }
    });

    console.log("Store Theme data deleted", deleteStoreTheme);

    const deleteStore = await prisma.stores.delete({
      where: { shop: shop }
    });

    console.log("Store data has been deleted", deleteStore);
  } catch (e) {
    console.log(e);
  }
};

export default appUninstallHandler;
