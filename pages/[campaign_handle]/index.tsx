import { useEffect, useState } from "react";
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
import { supabaseStorage } from "@/utils/supabase";
import getStorefrontAccessToken from "@/lib/auth/getStorefrontAccessToken";
import { RequiredStorePageProps, CampaignProduct } from "@/lib/types";
import getThemeConfig from "@/lib/theme/getThemeConfig";
import clientProvider from "@/utils/clientProvider";
import { useTheme } from "@/context/ThemeProvider";

interface PageProps extends RequiredStorePageProps {
  collection: Awaited<ReturnType<typeof getCampaignCollection>>;
  listing: Awaited<ReturnType<typeof getProductListing>>;
  isActive: boolean;
  previewToken: string; // TODO: Draft mode validation should be moved to server-side
  announcement?: string;
}

const CampaignPage: FC<PageProps> = ({
  collection,
  listing,
  isActive,
  previewToken,
  announcement,
  shop,
}) => {
  // const router = useRouter();
  const {
    global: { favicon },
  } = useTheme();
  const [prodList, setProdList] = useState(listing.products.nodes || []);
  const [prodCategories, setProdCategories] = useState<string[]>([]);

  useEffect(() => {
    const faviconElem = document.querySelector("head .favicon");

    faviconElem["href"] = favicon;
  }, [favicon]);

  useEffect(() => {
    if(!prodCategories || prodCategories.length <= 0) {
      const allTags = prodList.reduce((tags, currentProd) => { 
        return tags.concat([...currentProd.tags.filter((prodTag) => prodTag.includes("atelier:"))]);
      }, []);
      setProdCategories([...Array.from(new Set(allTags))])
    }
  }, [prodList]);

  useEffect(() => {
    console.log("these are prod categories", prodCategories);
  }, [prodCategories])

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
        products={prodList}
        setProducts={setProdList}
        categories={prodCategories}
      />

      <ProductGrid
        handle={collection.handle}
        products={prodList}
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

  const graphqlClientPromise = clientProvider.offline.graphqlClient({
    shop: merchant.shop,
  });

  const restClientPromise = clientProvider.offline.restClient({
    shop: merchant.shop,
  });

  const [{ client: graphqlClient }, { client: restClient }] = await Promise.all(
    [graphqlClientPromise, restClientPromise]
  );

  // 3. Get collection. This is static so server-render should be enough
  const collectionPromise = getCampaignCollection({
    client: graphqlClient,
    handle: handle as string,
    publicationId: merchant.publicationId,
  });

  // 4. Ger paginated product listing. This will change client-side so server-render only for the initial load
  const listingPromise = getProductListing({
    client: graphqlClient,
    handle: handle as string,
    publicationId: merchant.publicationId,
    pagination: {},
  });

  // 5. Get theme configuration
  const themePromise = getThemeConfig({
    shop: merchant.shop,
    handle: handle as string,
    restClient,
  });

  // 6. Get storefront access token
  const storefrontAccessTokenPromise = getStorefrontAccessToken({
    client: graphqlClient,
  });

  const [collection, listing, storefrontAccessToken, themeConfig] =
    await Promise.all([
      collectionPromise,
      listingPromise,
      storefrontAccessTokenPromise,
      themePromise,
    ]);

  return {
    props: {
      collection,
      isActive: campaign.isActive,
      listing,
      previewToken: campaign.previewToken,
      announcement: campaign.announcement,
      shop: merchant.shop,
      storefrontAccessToken,
      themeConfig,
    },
  };
};

export default CampaignPage;
