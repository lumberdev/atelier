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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { handle },
}) => {
  const url = new URL(
    req.url,
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      req.headers.host
    }`
  );
  const [subdomain] = url.hostname.split(".");
  const queryPreviewToken = url.searchParams.get("preview_token");

  if (["localhost", "atelier"].includes(subdomain))
    return {
      redirect: {
        destination: "",
        permanent: false,
      },
    };

  const merchant = await prisma.stores.findUnique({
    where: {
      identifier: subdomain,
    },
    include: {
      campaigns: {
        where: {
          handle: handle as string,
        },
        include: {
          accessPageConfig: true,
        },
      },
    },
  });

  const merchantSecret = merchant.secret;
  const [{ accessPageConfig: config, ...campaign }] = merchant.campaigns;
  const campaignPassword = config?.password;

  if (!config || !campaignPassword)
    return {
      props: {
        campaign,
      },
    };

  const authorized = authorizeRequest({
    req,
    merchantSecret,
    campaignPassword,
  });

  if (!authorized)
    return {
      redirect: {
        destination: `/${handle as string}/password${
          !campaign.isActive && queryPreviewToken
            ? `?preview_token=${queryPreviewToken}`
            : ""
        }`,
        permanent: false,
      },
    };

  return {
    props: {
      campaign,
    },
  };
};

function getUniqueProductsFromCollections(products, collections) {
  const allProducts = [...products];
  for (const collection of collections) {
    allProducts.push(...collection.products);
  }
  const uniqueProducts = allProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );
  return uniqueProducts;
}

const CampaignPage: FC<{ campaign: campaigns }> = ({ campaign }) => {
  const router = useRouter();
  const { handle } = router.query;
  const { collections, isLoading: collectionsLoading } = useCollections({
    store_id: campaign.storeId,
    collection_ids: campaign?.collectionIds,
  });
  const { products, isLoading: productsLoading } = useProducts({
    store_id: campaign.storeId,
    product_ids: campaign?.productIds,
  });
  const { showNotFoundPage } = useDraftCampaign({
    isCampaignActive: campaign.isActive,
    previewToken: campaign.previewToken,
  });

  if (showNotFoundPage) return <NotFoundPage />;

  if (productsLoading || collectionsLoading) return <LoadingScreen />;
  const homepageProducts = getUniqueProductsFromCollections(
    products,
    collections
  );

  return (
    <Page {...{ campaign }}>
      <AnnouncementBar
        announcement={campaign?.announcement}
        className="hidden lg:block"
      />
      <Header {...{ campaign, campaignHandle: handle, collections }} />
      <ProductGrid {...{ products: homepageProducts, handle }} />
    </Page>
  );
};

export default CampaignPage;
