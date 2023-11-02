import { authorizeRequest } from "@/lib/auth/authorizeRequest";
import prisma from "@/utils/prisma";
import { campaigns } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FC } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { useRouter } from "next/router";
import { useProductsOnStore } from "@/lib/hooks/useProductsOnStore";
import { useCollectionsOnStore } from "@/lib/hooks/useCollectionsOnStore";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";

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
        destination: `/campaign/${handle as string}/password`,
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
  const { collections, isLoading: collectionsLoading } = useCollectionsOnStore({
    store_id: campaign.storeId,
    collection_ids: campaign?.collectionIds,
  });
  const { products, isLoading: productsLoading } = useProductsOnStore({
    store_id: campaign.storeId,
    product_ids: campaign?.productIds,
  });
  if (productsLoading || collectionsLoading) return <LoadingScreen />;
  const homepageProducts = getUniqueProductsFromCollections(
    products,
    collections
  );

  return (
    <Page>
      <Header {...{ campaign, campaignHandle: handle, collections }} />
      <ProductGrid {...{ products: homepageProducts, handle }} />
    </Page>
  );
};

export default CampaignPage;
