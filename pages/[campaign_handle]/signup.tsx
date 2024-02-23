import prisma from "@/utils/prisma";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import NotFoundPage from "@/components/NotFoundPage";
import useDraftCampaign from "@/lib/hooks/store/useDraftCampaign";
import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";
import { RequiredStorePageProps } from "@/lib/types";
import getStorefrontAccessToken from "@/lib/auth/getStorefrontAccessToken";
import clientProvider from "@/utils/clientProvider";
import getThemeConfig from "@/lib/theme/getThemeConfig";
import { useTheme } from "@/context/ThemeProvider";

interface PageProps extends RequiredStorePageProps {
  handle: string;
  isActive: boolean;
  previewToken: string;
}

const CampaignSignupPage = ({
  handle,
  isActive,
  previewToken,
}: PageProps) => {
  const { replace } = useRouter();
  const { global, accessPage } = useTheme();
  const { register, handleSubmit } = useForm<{ email: string }>();
  const [error, setError] = useState<{ [key: string]: string }>({});
  const { showNotFoundPage } = useDraftCampaign({
    isCampaignActive: isActive,
    previewToken,
  });

  const { mutate: signIn } = useMutation<null, any, { email: string }>({
    mutationFn: ({ email }) =>
      axios.post("/api/auth/whitelistCheck", { email, campaign: handle }),
    onSuccess: () => {
      replace(`/${handle}`);
    },
    onError: (error) => {
      console.log(error);
      const data = error.response.data;
      setError({ PASSWORD: "You will be notified soon" });
    },
  });

  const onSubmitEmail = handleSubmit((fields: { email: string }) => {
    signIn({ email: fields.email });
  });

  const logo = global.logo;
  const layout = accessPage.layout;
  const backgroundColor = accessPage.backgroundColor;
  const backgroundImage = accessPage.backgroundImage;
  const headline = accessPage.headline;
  const body = accessPage.body;
  const placeholder = accessPage.passwordPlaceholder;
  const cta = {
    text: accessPage.ctaText,
    url: accessPage.ctaUrl,
  };

  if (showNotFoundPage) return <NotFoundPage />;

  if (layout === "STACKED")
    return (
      <div className="grid-rows-[25rem, 1fr] grid min-h-screen w-screen md:grid-cols-2 md:grid-rows-none">
        {backgroundImage && (
          <div className="relative">
            <Image
              src={backgroundImage}
              layout="fill"
              className="object-cover object-center"
              alt=""
            />
          </div>
        )}

        <div className="flex flex-col items-center px-4 pt-12 md:items-start md:justify-center md:p-8 md:px-24">
          {logo && (
            <div className="relative mb-8 h-8 w-32">
              <Image
                src={logo}
                layout="fill"
                className="object-contain"
                alt=""
              />
            </div>
          )}

          <h1 className="mb-2 text-2xl font-medium">Enter Email</h1>
          <p className="mb-8">{body}</p>

          <form onSubmit={onSubmitEmail} className="mb-8">
            <div className="flex w-max items-stretch overflow-hidden rounded-md border-2 border-solid border-black">
              <input
                className="bg-white px-2 py-2 text-black"
                placeholder="Enter Email"
                type="email"
                {...register("email")}
                required
              />
              <button className="bg-black px-2 text-white" type="submit">
                Enter
              </button>
            </div>
            {error.PASSWORD && <p>{error.PASSWORD}</p>}
          </form>

          {cta.text && cta.url && (
            <a className="text-sm underline" href={cta.url}>
              {cta.text}
            </a>
          )}
        </div>
      </div>
    );

  return (
    <div
      className="relative flex h-screen w-screen flex-col items-center justify-center bg-atelier p-8"
      style={{ "--atelier-bg-color": backgroundColor } as CSSProperties}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          layout="fill"
          className="object-cover"
          alt=""
        />
      )}

      <div className="relative flex w-11/12 max-w-xl flex-col items-center bg-white px-4 py-12 text-black md:justify-center md:p-8">
        {logo && (
          <div className="relative mb-8 h-8 w-32">
            <Image src={logo} layout="fill" className="object-contain" alt="" />
          </div>
        )}

        <h1 className="mb-2 text-2xl font-medium">Enter Email</h1>
        <p className="mb-8">{body}</p>
        
        <form onSubmit={onSubmitEmail} className="mb-8">
          <div className="flex w-max items-stretch overflow-hidden rounded-md border-2 border-solid border-black">
            <input
              className="bg-white px-2 py-2 text-black"
              placeholder="Enter Email"
              type="email"
              {...register("email")}
              required
            />
            <button className="bg-black px-2 text-white" type="submit">
              Enter
            </button>
          </div>

          {error.PASSWORD && <p>{error.PASSWORD}</p>}
        </form>

        {cta.text && cta.url && (
          <a className="text-sm underline" href={cta.url}>
            {cta.text}
          </a>
        )}
      </div>
    </div>
  );
};

export default CampaignSignupPage;

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  query: { campaign_handle },
}) => {
  const { url, subdomain } = getServerSideRequestUrl(req);

  // 1. Get merchant associated with shop and handle
  const merchant = await prisma.stores.findUnique({
    where: {
      identifier: subdomain,
    },
    select: {
      shop: true,
      campaigns: {
        where: { handle: campaign_handle as string },
        select: {
          isActive: true,
          previewToken: true,
        },
      },
    },
  });

  const graphqlClientPromise = clientProvider.offline.graphqlClient({
    shop: merchant.shop,
  });

  const restClientPromise = clientProvider.offline.restClient({
    shop: merchant.shop,
  });

  const [{ client: graphqlClient }, { client: restClient }] = await Promise.all(
    [graphqlClientPromise, restClientPromise]
  );

  // 2. Get theme configuration
  const themePromise = getThemeConfig({
    shop: merchant.shop,
    handle: campaign_handle as string,
    restClient,
  });

  // 3. Get storefront access token
  const storefrontAccessTokenPromise = getStorefrontAccessToken({
    client: graphqlClient,
  });

  const [storefrontAccessToken, themeConfig] = await Promise.all([
    storefrontAccessTokenPromise,
    themePromise,
  ]);

  const [campaign] = merchant.campaigns;

  return {
    props: {
      handle: campaign_handle as string,
      shop: merchant.shop,
      isActive: campaign.isActive,
      previewToken: campaign.previewToken,
      storefrontAccessToken,
      themeConfig,
    },
  };
};
