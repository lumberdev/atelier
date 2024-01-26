import {
  CookieNotFound,
  InvalidOAuthError,
  InvalidSession,
} from "@shopify/shopify-api";
import prisma from "@/utils/prisma";
import sessionHandler from "@/utils/sessionHandler.js";
import shopify from "@/utils/shopify.js";
import clientProvider from "@/utils/clientProvider";

const handler = async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    await sessionHandler.storeSession(session);

    const host = req.query.host;
    const { shop } = session;

    const { client: graphqlClient } =
      await clientProvider.offline.graphqlClient({
        shop,
      });

    const response = await graphqlClient.query({
      data: `
      query ShopPublication {
        currentAppInstallation {
          publication {
            id
          }
        }
      }
    `,
    });

    const publication = (response.body as any).data?.currentAppInstallation
      ?.publication;

    await prisma.stores.upsert({
      where: { shop: shop },
      update: { isActive: true },
      create: {
        shop: shop,
        isActive: true,
        publicationId: publication.id,
        theme: { create: { borderRadius: 0 } },
      },
    });

    // Redirect to app with shop parameter upon auth
    res.redirect(`/app?shop=${shop}&host=${host}`);
  } catch (e) {
    console.error("---> An error occured at /auth/callback", e);
    const { shop } = req.query;
    switch (true) {
      case e instanceof CookieNotFound:
        res.redirect(`/exitframe/${shop}`);
        break;
      case e instanceof InvalidOAuthError:
      case e instanceof InvalidSession:
        res.redirect(`/api/auth?shop=${shop}`);
        break;
      default:
        res.status(500).send(e.message);
        break;
    }
  }
};

export default handler;
