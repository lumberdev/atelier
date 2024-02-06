import { authorizeRequest } from "@/lib/auth/authorizeRequest";
import prisma from "@/utils/prisma";
import { campaigns } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FC } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { useRouter } from "next/router";
import { useProducts } from "@/lib/hooks/store/useProducts";
import { useCollections } from "@/lib/hooks/store/useCollections";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";
import NotFoundPage from "@/components/NotFoundPage";
import useDraftCampaign from "@/lib/hooks/store/useDraftCampaign";
import getCampaignForRequest from "@/lib/campaign/getCampaignForRequest";
import verifyAccessPermission from "@/lib/campaign/verifyAccessPermission";
import getProductListing from "@/lib/campaign/getProductListing";
import getCampaignCollection from "@/lib/campaign/getCampaignCollection";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/utils/queryClient";
import { CartProvider } from "@/context/CartContext";
import SlidingCart from "@/components/cart/SlidingCart";

interface PageProps {
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
}) => {
  // const router = useRouter();

  // TODO: Move this to server-side to avoid leaking the preview token
  const { showNotFoundPage } = useDraftCampaign({
    isCampaignActive: isActive,
    previewToken: previewToken,
  });

  if (showNotFoundPage) return <NotFoundPage />;

  // if (productsLoading || collectionsLoading) return <LoadingScreen />;

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

  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <CartProvider>
  //       <Page {...{ campaign }}>
  //         <AnnouncementBar
  //           announcement={campaign?.announcement}
  //           className="hidden lg:block"
  //         />
  //         <Header {...{ campaign, campaignHandle: handle, collections }} />
  //         <ProductGrid {...{ products: homepageProducts, handle }} />
  //       </Page>
  //       <SlidingCart />
  //     </CartProvider>
  //   </QueryClientProvider>
  // );

  return <pre>{JSON.stringify({ collection, listing }, null, 2)}</pre>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  query: { handle },
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
  const collection = await getCampaignCollection({
    shop: merchant.shop,
    handle: handle as string,
    publicationId: merchant.publicationId,
  });

  // 4. Ger paginated product listing. This will change client-side so server-render only for the initial load
  const listing = await getProductListing({
    handle: handle as string,
    shop: merchant.shop,
    publicationId: merchant.publicationId,
    pagination: {},
  });

  return {
    props: {
      collection,
      isActive: campaign.isActive,
      listing,
      previewToken: campaign.previewToken,
      announcement: campaign.announcement,
    },
  };
};

export default CampaignPage;
