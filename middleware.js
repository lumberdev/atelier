/*
    Add Content Security Policy headers to all relevant requests.
*/

import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Exceptions:
     * /api/auth, /api/webhooks, /api/proxy_route, /api/gdpr, /_next,
     * /_proxy, /_auth, /_static, /_vercel, /public (/favicon.ico, etc)
     */
    "/((?!api/auth|api/webhooks|api/proxy_route|api/gdpr|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export function middleware(request) {
  const {
    nextUrl: { pathname, search },
  } = request;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const shop = params.shop || "*.myshopify.com";

  const res = NextResponse.next();
  console.log(pathname)

  // Exclude "/admin/index.html" and "/", this causes tinacms admin panel and live preview to crash 
  if (!(pathname.includes("/admin/index.html") || pathname === "/")) {
    res.headers.set(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com;`
    );
  }
  
  // You can also set request headers in NextResponse.rewrite
  return res;
}
