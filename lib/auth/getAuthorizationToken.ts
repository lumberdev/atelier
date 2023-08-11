import * as crypto from "crypto";

export const getAuthorizationToken = ({
  merchantSecret,
  campaignPassword,
}: {
  merchantSecret: string;
  campaignPassword: string;
}) => {
  if (!process.env.ATELIER_SECRET)
    throw Error(
      "Unable to create authorization token. No ATELIER_SECRET provided."
    );

  const hmac = crypto
    .createHash("sha256")
    .update(process.env.ATELIER_SECRET)
    .update(merchantSecret)
    .update(campaignPassword)
    .digest("hex");

  return hmac;
};
