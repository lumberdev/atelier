import ProductPage from "@/components/ProductPage";
import { GetServerSideProps } from "next";
import getCampaignCollection from "@/lib/campaign/getCampaignCollection";
import { FC } from "react";
import getCampaignForRequest from "@/lib/campaign/getCampaignForRequest";
import verifyAccessPermission from "@/lib/campaign/verifyAccessPermission";
import getProductDetails from "@/lib/campaign/getProductDetails";
import Header from "@/components/Header";
import { RequiredStorePageProps } from "@/lib/types";
import getStorefrontAccessToken from "@/lib/auth/getStorefrontAccessToken";
import clientProvider from "@/utils/clientProvider";
import getThemeConfig from "@/lib/theme/getThemeConfig";

interface PageProps extends RequiredStorePageProps {
  collection: Awaited<ReturnType<typeof getCampaignCollection>>;
  product: Awaited<ReturnType<typeof getProductDetails>>;
  announcement?: string;
}

const ProductDetailPage: FC<PageProps> = ({
  collection,
  product,
  announcement,
}) => {
  return (
    <div className="min-h-screen">
      <Header
        title={product.title}
        campaignHandle={collection.handle}
        announcement={announcement}
      />

      <ProductPage product={product} />
    </div>
  );
};

export default ProductDetailPage;

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
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

  const [collection, product, storefrontAccessToken, themeConfig] =
    await Promise.all([
      collectionPromise,
      productPromise,
      storefrontAccessTokenPromise,
      themePromise,
    ]);

  return {
    props: {
      collection,
      product,
      announcement: campaign.announcement,
      shop: merchant.shop,
      storefrontAccessToken,
      themeConfig,
    },
  };
};
