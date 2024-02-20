import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { FC } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import NotFoundPage from "@/components/NotFoundPage";
import useDraftCampaign from "@/lib/hooks/store/useDraftCampaign";
import getCampaignForRequest from "@/lib/campaign/getCampaignForRequest";
import verifyAccessPermission from "@/lib/campaign/verifyAccessPermission";
import getProductListing from "@/lib/campaign/getProductListing";
import getCampaignCollection from "@/lib/campaign/getCampaignCollection";
import { getCampaignTheme } from "@/lib/theme/getCampaignThemeConfig";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";
import { supabaseStorage } from "@/utils/supabase";
import getStorefrontAccessToken from "@/lib/auth/getStorefrontAccessToken";
import { RequiredStorePageProps } from "@/lib/types";
import clientProvider from "@/utils/clientProvider";

interface PageProps extends RequiredStorePageProps {
  collection: Awaited<ReturnType<typeof getCampaignCollection>>;
  listing: Awaited<ReturnType<typeof getProductListing>>;
  isActive: boolean;
  previewToken: string; // TODO: Draft mode validation should be moved to server-side
  announcement?: string;
  defaultFavUrl?: string;
}

const CampaignPage: FC<PageProps> = ({
  collection,
  listing,
  isActive,
  previewToken,
  announcement,
  defaultFavUrl,
  shop,
}) => {
  // const router = useRouter();
  const {
    global: { favicon },
  } = useTheme() as { global: storeThemes };

  useEffect(() => {
    const faviconElem = document.querySelector("head .favicon");
    if (favicon) {
      const image = supabaseStorage.getPublicUrl(favicon);
      faviconElem["href"] = image?.data.publicUrl || "";
      return;
    }

    faviconElem["href"] = `https://${shop}/cdn/shop/files/${defaultFavUrl}`;
  }, [favicon]);

  // TODO: Move this to server-side to avoid leaking the preview token
  const { showNotFoundPage } = useDraftCampaign({
    isCampaignActive: isActive,
    previewToken: previewToken,
  });

  if (showNotFoundPage) return <NotFoundPage />;

  return (
    <div className="min-h-screen">
      <Header
        title={collection.title}
        campaignHandle={collection.handle}
        announcement={announcement}
      />

      <ProductGrid
        handle={collection.handle}
        products={listing.products.nodes}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  query: { campaign_handle: handle },
}) => {
  // 1. Get campaign associated with shop and handle
  const {
    data,
    redirect: invalidCampaignRequestError,
    notFound,
  } = await getCampaignForRequest({
    req,
    campaignHandle: handle as string,
  });

  if (!data && invalidCampaignRequestError)
    return { redirect: invalidCampaignRequestError };

  if (!data && notFound) return { notFound: true };

  const { merchant, config, campaign } = data;

  // 2. Run access control
  const authorization = await verifyAccessPermission({
    req,
    merchant,
    campaign: {
      handle: handle as string,
      password: config.password,
      ...campaign,
    },
  });

  if (authorization.notFound || authorization.redirect) return authorization;

  // 3. Get collection. This is static so server-render should be enough
  const collectionPromise = getCampaignCollection({
    shop: merchant.shop,
    handle: handle as string,
    publicationId: merchant.publicationId,
  });

  // 4. Ger paginated product listing. This will change client-side so server-render only for the initial load
  const listingPromise = getProductListing({
    handle: handle as string,
    shop: merchant.shop,
    publicationId: merchant.publicationId,
    pagination: {},
  });

  const { client } = await clientProvider.offline.restClient({ shop: merchant.shop });
  const theme_config = await getCampaignTheme({ shop: merchant.shop, client });
  const faviconUrl = theme_config.current["favicon"]?.split("/").reverse()[0];

  // 5. Get storefront access token
  const storefrontAccessTokenPromise = getStorefrontAccessToken({
    shop: merchant.shop,
  });

  const [collection, listing, storefrontAccessToken] = await Promise.all([
    collectionPromise,
    listingPromise,
    storefrontAccessTokenPromise,
  ]);

  return {
    props: {
      collection,
      isActive: campaign.isActive,
      listing,
      previewToken: campaign.previewToken,
      announcement: campaign.announcement,
      defaultFavUrl: faviconUrl,
      shop: merchant.shop,
      storefrontAccessToken,
    },
  };
};

export default CampaignPage;
