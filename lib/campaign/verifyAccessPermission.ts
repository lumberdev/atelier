import { GetServerSidePropsContext, Redirect } from "next";
import { authorizeRequest } from "../auth/authorizeRequest";
import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";

const verifyAccessPermission = ({
  req,
  merchant,
  campaign,
}: {
  req: GetServerSidePropsContext["req"];
  merchant: {
    isActive: boolean;
    secret: string;
  };
  campaign: {
    handle: string;
    isActive: boolean;
    password?: string;
  };
}):
  | { redirect: Redirect; notFound?: never; authorized?: never }
  | { notFound: true; redirect?: never; authorized?: never }
  | { authorized: true; redirect?: never; notFound?: never } => {
  const url = getServerSideRequestUrl(req);
  const queryPreviewToken = url.searchParams.get("preview_token");

  // 1. Is merchant active?
  if (!merchant.isActive)
    return {
      notFound: true,
    };

  // 2. Is campaign protected?
  // 2.a Not protected, continue
  if (!campaign.password) return { authorized: true };

  // 2.b Protected, verify password
  const authorized = authorizeRequest({
    req,
    merchantSecret: merchant.secret,
    campaignPassword: campaign.password,
  });

  if (!authorized) {
    const params = new URLSearchParams({ preview_token: queryPreviewToken });
    const query =
      !campaign.isActive && queryPreviewToken ? `?${params.toString()}` : "";

    return {
      redirect: {
        destination: `/${campaign.handle}/password${query}`,
        permanent: false,
      },
    };
  }

  return { authorized: true };
};

export default verifyAccessPermission;
