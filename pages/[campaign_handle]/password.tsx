import prisma from "@/utils/prisma";
import { supabaseStorage } from "@/utils/supabase";
import { accessPageConfig, storeThemes } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import NotFoundPage from "@/components/NotFoundPage";
import useDraftCampaign from "@/lib/hooks/store/useDraftCampaign";
import getServerSideRequestUrl from "@/utils/getServerSideRequestUrl";
import { RequiredStorePageProps } from "@/lib/types";
import getStorefrontAccessToken from "@/lib/auth/getStorefrontAccessToken";

interface PageProps extends RequiredStorePageProps {
  config: Pick<
    accessPageConfig,
    | "layout"
    | "headline"
    | "body"
    | "backgroundColor"
    | "backgroundImage"
    | "ctaText"
    | "ctaUrl"
    | "passwordPlaceholder"
  >;
  theme: storeThemes;
  isCampaignActive: boolean;
  previewToken: string;
}

const CampaignPasswordPage = ({
  config,
  theme,
  isCampaignActive,
  previewToken,
}: PageProps) => {
  const { query, replace } = useRouter();
  const { register, handleSubmit } = useForm<{ password: string }>();
  const [error, setError] = useState<{ [key: string]: string }>({});
  const { showNotFoundPage } = useDraftCampaign({
    isCampaignActive,
    previewToken,
  });

  const { mutate: signIn } = useMutation<null, any, { password: string }>({
    mutationFn: ({ password }) =>
      axios.post("/api/auth/password", { password, campaign: query.handle }),
    onSuccess: () => {
      replace(`/${query.handle}`);
    },
    onError: (error) => {
      const data = error.response.data;
      setError({ PASSWORD: data.message ?? "Invalid password" });
    },
  });

  const onSubmit = handleSubmit((fields: { password: string }) => {
    signIn({ password: fields.password });
  });

  const logo = theme.logo ? supabaseStorage.getPublicUrl(theme.logo) : null;
  const layout = config.layout;
  const backgroundColor = config.backgroundColor;
  const backgroundImage = config.backgroundImage
    ? supabaseStorage.getPublicUrl(config.backgroundImage)
    : null;
  const headline = config.headline;
  const body = config.body;
  const placeholder = config.passwordPlaceholder;
  const cta = {
    text: config.ctaText,
    url: config.ctaUrl,
  };

  if (showNotFoundPage) return <NotFoundPage />;

  if (layout === "STACKED")
    return (
      <div className="grid-rows-[25rem, 1fr] grid min-h-screen w-screen md:grid-cols-2 md:grid-rows-none">
        {backgroundImage && (
          <div className="relative">
            <Image
              src={backgroundImage.data.publicUrl}
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
                src={logo.data.publicUrl}
                layout="fill"
                className="object-contain"
                alt=""
              />
            </div>
          )}

          <h1 className="mb-2 text-2xl font-medium">{headline}</h1>
          <p className="mb-8">{body}</p>

          <form onSubmit={onSubmit} className="mb-8">
            <div className="flex w-max items-stretch overflow-hidden rounded-md border-2 border-solid border-black">
              <input
                className="bg-white px-2 py-2 text-black"
                placeholder={placeholder}
                type="password"
                {...register("password")}
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
      className="relative flex h-screen w-screen flex-col items-center justify-center p-8"
      style={{ backgroundColor: backgroundColor, color: "#ffffff" }}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage.data.publicUrl}
          layout="fill"
          className="object-cover"
          alt=""
        />
      )}

      <div className="relative flex w-11/12 max-w-xl flex-col items-center bg-white px-4 py-12 text-black md:justify-center md:p-8">
        {logo && (
          <div className="relative mb-8 h-8 w-32">
            <Image
              src={logo.data.publicUrl}
              layout="fill"
              className="object-contain"
              alt=""
            />
          </div>
        )}

        <h1 className="mb-2 text-2xl font-medium">{headline}</h1>
        <p className="mb-8">{body}</p>

        <form onSubmit={onSubmit} className="mb-8">
          <div className="flex w-max items-stretch overflow-hidden rounded-md border-2 border-solid border-black">
            <input
              className="bg-white px-2 py-2 text-black"
              placeholder={placeholder}
              type="password"
              {...register("password")}
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

export default CampaignPasswordPage;

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
    include: {
      campaigns: {
        where: {
          handle: campaign_handle as string,
        },
      },
      theme: true,
    },
  });

  const theme = merchant.theme;
  const [campaign] = merchant.campaigns;

  // 2. Get access control config
  const configPromise = await prisma.accessPageConfig.findUnique({
    where: { campaignId: campaign.id },
  });

  // 3. Get storefront access token
  const storefrontAccessTokenPromise = getStorefrontAccessToken({
    shop: merchant.shop,
  });

  const [config, storefrontAccessToken] = await Promise.all([
    configPromise,
    storefrontAccessTokenPromise,
  ]);

  return {
    props: {
      config,
      theme,
      isCampaignActive: campaign.isActive,
      previewToken: campaign.previewToken,
      shop: merchant.shop,
      storefrontAccessToken,
    },
  };
};
