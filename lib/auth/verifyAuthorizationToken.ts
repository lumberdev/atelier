import { getAuthorizationToken } from "./getAuthorizationToken";

export const verifyAuthorizationToken = ({
  token,
  merchantSecret,
  campaignPassword,
}: {
  token: string;
  merchantSecret: string;
  campaignPassword: string;
}) => {
  const hmac = getAuthorizationToken({ merchantSecret, campaignPassword });

  return hmac === token;
};
