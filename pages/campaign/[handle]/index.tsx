import { authorizeRequest } from "@/lib/auth/authorizeRequest";
import prisma from "@/utils/prisma";
import { campaigns } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FC } from "react";
import NavBar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { useRouter } from "next/router";
import { useProductsOnStore } from "@/lib/hooks/useProductsOnStore";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { handle },
}) => {
  const merchant = await prisma.stores.findUnique({
    where: {
      identifier: "river",
    },
    include: {
      campaigns: {
        where: {
          handle: handle as string,
        },
      },
    },
  });

  const merchantSecret = merchant.secret;
  const [campaign] = merchant.campaigns;
  const campaignPassword = campaign.password;

  if (!campaignPassword)
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

const CampaignPage: FC<{ campaign: campaigns }> = ({ campaign }) => {
  const router = useRouter();
  const { handle } = router.query;
  const productIDs = campaign?.resourceIds;

  // ^ This is not always product ids, it can be of product ids OR collection ids
  console.log(productIDs);

  const { products, isLoading: productsLoading } = useProductsOnStore({
    store_id: campaign.storeId,
    product_ids: productIDs,
  });

  if (productsLoading) return <LoadingScreen />;

  return (
    <Page>
      <NavBar {...{ campaign, handle }} />
      <ProductGrid {...{ products, handle }} />
    </Page>
  );
};

export default CampaignPage;
