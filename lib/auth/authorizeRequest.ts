import { verifyAuthorizationToken } from "./verifyAuthorizationToken";
import { GetServerSidePropsContext } from "next";

export const authorizeRequest = ({
  req,
  merchantSecret,
  campaignPassword,
}: {
  req: GetServerSidePropsContext["req"];
  merchantSecret: string;
  campaignPassword: string;
}) => {
  const token = req.cookies["auth_token"];

  if (!token) return false;

  return verifyAuthorizationToken({
    token: token,
    merchantSecret,
    campaignPassword,
  });
};
