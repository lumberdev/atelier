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

interface ServerSideProps {
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
}

export const getServerSideProps: GetServerSideProps = (async (ctx) => {
  const handle = ctx.query.handle as string;

  const url = new URL(
    ctx.req.url,
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      ctx.req.headers.host
    }`
  );
  const [subdomain] = url.hostname.split(".");

  const merchant = await prisma.stores.findUnique({
    where: {
      identifier: subdomain,
    },
    include: {
      campaigns: {
        where: {
          handle: handle as string,
        },
      },
      theme: true,
    },
  });

  const theme = merchant.theme;
  const [campaign] = merchant.campaigns;

  const config = await prisma.accessPageConfig.findUnique({
    where: { campaignId: campaign.id },
  });

  return {
    props: { config, theme },
  };
}) satisfies GetServerSideProps<ServerSideProps>;

const CampaignPasswordPage = ({ config, theme }: ServerSideProps) => {
  const { query, replace } = useRouter();
  const { register, handleSubmit } = useForm<{ password: string }>();
  const [error, setError] = useState<{ [key: string]: string }>({});

  const { mutate: signIn } = useMutation<null, any, { password: string }>({
    mutationFn: ({ password }) =>
      axios.post("/api/auth/password", { password, campaign: query.handle }),
    onSuccess: () => {
      replace(`/campaign/${query.handle}`);
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

  if (layout === "STACKED")
    return (
      <div className="grid grid-rows-[25rem, 1fr] w-screen min-h-screen md:grid-rows-none md:grid-cols-2">
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

        <div className="px-4 pt-12 flex flex-col items-center md:p-8 md:justify-center md:items-start md:px-24">
          {logo && (
            <div className="relative w-32 h-8 mb-8">
              <Image
                src={logo.data.publicUrl}
                layout="fill"
                className="object-contain"
                alt=""
              />
            </div>
          )}

          <h1 className="text-2xl mb-2 font-medium">{headline}</h1>
          <p className="mb-8">{body}</p>

          <form onSubmit={onSubmit} className="mb-8">
            <div className="flex items-stretch border-solid border-2 border-black rounded-md overflow-hidden w-max">
              <input
                className="bg-white px-2 py-2 text-black"
                placeholder={placeholder}
                type="password"
                {...register("password")}
                required
              />
              <button className="bg-black text-white px-2" type="submit">
                Enter
              </button>
            </div>

            {error.PASSWORD && <p>{error.PASSWORD}</p>}
          </form>

          {cta.text && cta.url && (
            <a className="underline text-sm" href={cta.url}>
              {cta.text}
            </a>
          )}
        </div>
      </div>
    );

  return (
    <div
      className="relative h-screen w-screen flex flex-col items-center justify-center p-8"
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

      <div className="relative px-4 py-12 flex flex-col items-center bg-white text-black w-11/12 max-w-xl md:p-8 md:justify-center">
        {logo && (
          <div className="relative w-32 h-8 mb-8">
            <Image
              src={logo.data.publicUrl}
              layout="fill"
              className="object-contain"
              alt=""
            />
          </div>
        )}

        <h1 className="text-2xl mb-2 font-medium">{headline}</h1>
        <p className="mb-8">{body}</p>

        <form onSubmit={onSubmit} className="mb-8">
          <div className="flex items-stretch border-solid border-2 border-black rounded-md overflow-hidden w-max">
            <input
              className="bg-white px-2 py-2 text-black"
              placeholder={placeholder}
              type="password"
              {...register("password")}
              required
            />
            <button className="bg-black text-white px-2" type="submit">
              Enter
            </button>
          </div>

          {error.PASSWORD && <p>{error.PASSWORD}</p>}
        </form>

        {cta.text && cta.url && (
          <a className="underline text-sm" href={cta.url}>
            {cta.text}
          </a>
        )}
      </div>
    </div>
  );
};

export default CampaignPasswordPage;
