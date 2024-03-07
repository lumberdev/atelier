import ProductPage from "@/components/ProductPage";
import { GetServerSideProps } from "next";
import getCampaignCollection from "@/lib/campaign/getCampaignCollection";
import { FC, useEffect, useState } from "react";
import getProductListing from "@/lib/campaign/getProductListing";
import getCampaignForRequest from "@/lib/campaign/getCampaignForRequest";
import verifyAccessPermission from "@/lib/campaign/verifyAccessPermission";
import getProductDetails from "@/lib/campaign/getProductDetails";
import Header from "@/components/Header";
import { RequiredStorePageProps } from "@/lib/types";
import getStorefrontAccessToken from "@/lib/auth/getStorefrontAccessToken";
import clientProvider from "@/utils/clientProvider";
import getThemeConfig from "@/lib/theme/getThemeConfig";

interface PageProps extends RequiredStorePageProps {
  listing: Awaited<ReturnType<typeof getProductListing>>;
  collection: Awaited<ReturnType<typeof getCampaignCollection>>;
  product: Awaited<ReturnType<typeof getProductDetails>>;
  announcement?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;
  campaignTitle?: string;
  campaignDescription?: string;
}

const ProductDetailPage: FC<PageProps> = ({
  listing,
  collection,
  product,
  announcement,
  announcementBgColor,
  announcementTextColor
}) => {
  const [prodList, setProdList] = useState(listing.products.nodes || []);
  const [prodCategories, setProdCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!prodCategories || prodCategories.length <= 0) {
      const allTags = prodList.reduce((tags, currentProd) => {
        return tags.concat([
          ...currentProd.tags.filter((prodTag) => prodTag.includes("atelier:")),
        ]);
      }, []);
      setProdCategories([...Array.from(new Set(allTags))]);
    }
  }, [prodList]);
  return (
    <div className="min-h-screen">
      <Header
        title={collection.handle} // this is just for logo alt text
        campaignHandle={collection.handle}
        announcement={announcement}
        announcementBgColor={announcementBgColor}
        announcementTextColor={announcementTextColor}
        allProducts={listing.products.nodes}
        setProducts={setProdList}
        categories={prodCategories}
      />

      <ProductPage product={product} />
    </div>
  );
};

export default ProductDetailPage;

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
  query: { campaign_handle: handle, product_handle: productHandle },
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
    res,
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

  // 4. Get product details. This is also static
  const productPromise = getProductDetails({
    client: graphqlClient,
    handle: productHandle as string,
    publicationId: merchant.publicationId,
  });

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

  const [collection, listing, product, storefrontAccessToken, themeConfig] =
    await Promise.all([
      collectionPromise,
      listingPromise,
      productPromise,
      storefrontAccessTokenPromise,
      themePromise,
    ]);

  return {
    props: {
      previewMode: authorization.previewMode,
      collection,
      listing,
      product,
      announcement: campaign.announcement,
      announcementBgColor: campaign.announcementBgColor,
      announcementTextColor: campaign.announcementTextColor,
      shop: merchant.shop,
      storefrontAccessToken,
      themeConfig,
      canPreviewAccessPage: !!config.password,
    },
  };
};
