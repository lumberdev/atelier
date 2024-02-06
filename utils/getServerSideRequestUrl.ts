import { GetServerSidePropsContext } from "next";

const getServerSideRequestUrl = (req: GetServerSidePropsContext["req"]) => {
  const url = new URL(
    req.url,
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      req.headers.host
    }`
  );

  if (process.env.NODE_ENV === "production") {
    const [tld, domain, subdomain] = url.hostname.split(".").reverse();

    return { url, subdomain };
  }

  const [subdomain] = url.hostname.split(".");

  return { url, subdomain };
};

export default getServerSideRequestUrl;
