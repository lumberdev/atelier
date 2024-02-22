import { GetServerSidePropsContext, Redirect } from "next";
import { authorizeRequest } from "../auth/authorizeRequest";
import { authorizePreviewModeRequest } from "../auth/preview-mode/authorizePreviewModeRequest";
import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";

const verifyAccessPermission = ({
  req,
  res,
  merchant,
  campaign,
}: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  merchant: {
    isActive: boolean;
    secret: string;
  };
  campaign: {
    handle: string;
    isActive: boolean;
    password?: string;
    previewToken?: string;
  };
}):
  | {
      redirect: Redirect;
      notFound?: never;
      authorized?: never;
      previewMode?: never;
    }
  | {
      notFound: true;
      redirect?: never;
      authorized?: never;
      previewMode?: never;
    }
  | {
      authorized: true;
      previewMode: boolean;
      redirect?: never;
      notFound?: never;
    } => {
  const { url } = getServerSideRequestUrl(req);

  // 1. Is merchant active?
  if (!merchant.isActive)
    return {
      notFound: true,
    };

  // 2. Is campaign in preview mode?
  if (!campaign.isActive) {
    const authorized = authorizePreviewModeRequest({
      req,
      res,
      params: url.searchParams,
      previewToken: campaign.previewToken,
    });

    if (!authorized) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }

    return { authorized: true, previewMode: true };
  }

  // 3. Is campaign protected?
  // 3.a Not protected, continue
  if (!campaign.password) return { authorized: true, previewMode: false };

  // 3.b Protected, verify password
  const authorized = authorizeRequest({
    req,
    merchantSecret: merchant.secret,
    campaignPassword: campaign.password,
  });

  if (!authorized) {
    return {
      redirect: {
        destination: `/${campaign.handle}/password`,
        permanent: false,
      },
    };
  }

  return { authorized: true, previewMode: false };
};

export default verifyAccessPermission;
