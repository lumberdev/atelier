import { GetServerSidePropsContext } from "next";

const getServerSideRequestUrl = (req: GetServerSidePropsContext["req"]) => {
  const url = new URL(
    req.url,
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      req.headers.host
    }`
  );

  return url;
};

export default getServerSideRequestUrl;
