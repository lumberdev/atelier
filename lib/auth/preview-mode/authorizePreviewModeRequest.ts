import { serialize } from "cookie";
import { GetServerSidePropsContext } from "next";

export const authorizePreviewModeRequest = ({
  req,
  res,
  params,
  previewToken,
}: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  params: URLSearchParams;
  previewToken?: string;
}) => {
  const tokenInCookies = req.cookies["preview_token"];
  const tokenInParams = params.get("preview_token") as string;

  if ((!tokenInCookies && !tokenInParams) || !previewToken) return false;

  // If token is in query params, and is a valid token get it to a cookie
  if (tokenInParams && tokenInParams === previewToken) {
    // TODO: Make this cookie secure
    const cookie = serialize("preview_token", tokenInParams, {
      httpOnly: false,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    return true;
  }

  return tokenInCookies && tokenInCookies === previewToken;
};
