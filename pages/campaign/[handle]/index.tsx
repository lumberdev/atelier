import { authorizeRequest } from "@/lib/auth/authorizeRequest";
import prisma from "@/utils/prisma";
import { campaigns } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FC } from "react";

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
  return (
    <div>
      <h1>{campaign.title}</h1>
      <p>{`collectionIds: ${campaign.collectionIds}`}</p>
      <p>{`productIds: ${campaign.productIds}`}</p>
      <p>{`variantIds: ${campaign.variantIds}`}</p>
    </div>
  );
};

export default CampaignPage;
