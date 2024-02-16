import useFetch from "@/components/hooks/useFetch";
import { supabaseStorage } from "@/utils/supabase";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeThemes } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { StoreThemeInput } from "../../types";
import { useStoreSettings } from "./useStoreSettings";

const schema = yup
  .object({
    id: yup.string().optional(),
    favicon: yup.string().optional()
  })
  .required();

export const useStoreMetadataForm = ({
  favicon,
  onUpsert = () => {},
}: {
  favicon?: string;
  onUpsert?: () => void;
}) => {
  const router = useRouter();
  const fetch = useFetch();
  const {
    settings: { shop },
  } = useStoreSettings();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [faviconUrl, setFaviconUrl] = useState<string>(() => {
    if (!favicon) return "";
    const image = supabaseStorage.getPublicUrl(favicon);

    return image?.data.publicUrl ?? "";
  });

  const [didSelectImageFile, setDidSelectImageFile] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File>();

  /**
   * TODO: Allows automatic update on the editor
   */
  // useEffect(() => {
  //   (async function () {
  //     const theme_config = await getCampaignThemeConfig({ shop });
  //     const favicon_url = theme_config.current["favicon"]?.split("/").reverse()[0];
      
  //     const newfile = await fetch(`https://${shop}/cdn/shop/files/${favicon_url}`)
  //     .then(res => res.blob())
  //     .then(blob => {
  //       const fileExt = favicon_url.split(".").reverse()[0];
  //       const file = new File([blob], favicon_url, { type: blob.type });
  //       return file;
  //     })

  //     console.log("newfile", newfile);
  //   })();
  // }, []);

  const { mutate: upsertTheme } = useMutation<
    { theme?: storeThemes; error?: { code: string; message: string } },
    any,
    { data: StoreThemeInput }
  >(
    (variables) =>
      fetch("/api/apps/store-themes", {
        method: "POST",
        body: JSON.stringify(variables.data),
      }).then((response) => response.json()),
    {
      onSuccess: async (response) => {
        if (response.error || !response.theme) {
          // TODO: Handle error state
          return;
        }

        const theme = response.theme;
        setIsLoading(false);
        onUpsert();
      },
    }
  );

  const { data = { theme: {} } } = useQuery<{ theme: storeThemes }>({
    queryKey: "theme",
    queryFn: () =>
      fetch("/api/apps/store-themes").then((response) => response.json()),
    onSuccess: (response) => {
      if (!response.theme?.id || form.getValues("id")) return;
      const theme = response.theme;

      form.setValue("id", theme.id);
    //   if (theme.primaryColor) form.setValue("primaryColor", theme.primaryColor);
    //   if (theme.secondaryColor)
    //     form.setValue("secondaryColor", theme.secondaryColor);
    //   if (theme.backgroundColor)
    //     form.setValue("backgroundColor", theme.backgroundColor);
    //   if (theme.borderRadius !== null)
    //     form.setValue("borderRadius", theme.borderRadius + "");
    //   if (theme.logoPosition) form.setValue("logoPosition", theme.logoPosition);

      if (theme.favicon) {
        const url = supabaseStorage.getPublicUrl(theme.favicon);
        setFaviconUrl(url.data.publicUrl ?? "");
      }
    },
  });

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!imageFile && didSelectImageFile) {
      setFaviconUrl("");
      return;
    }

    if (imageFile) {
      setFaviconUrl(window.URL.createObjectURL(imageFile));
      setDidSelectImageFile(true);
    }
  }, [imageFile]);

  const onSubmit = handleSubmit(async (fields: StoreThemeInput) => {
    setIsLoading(true);

    if (imageFile) {
      // 1. Upload image
      const [shopId] = shop.split(".");
      const fileName = "favicon";
      const [fileExt] = imageFile.name.split(".").reverse();

      const storageResponse = await supabaseStorage.upload(
        `${shopId}/${fileName}.${fileExt}`,
        imageFile,
        { upsert: true }
      );
      const favicon = storageResponse.data?.path ?? "";
      // 2. Upload data
      upsertTheme({
        data: {
          ...fields,
          favicon,
          borderRadius: Number(fields.borderRadius) || 0,
        },
      });
      return;
    }

    upsertTheme({
      data: { ...fields, borderRadius: Number(fields.borderRadius) || 0, },
    });
  });

  return {
    faviconUrl,
    imageFile,
    setImageFile,
    onSubmit,
    isLoading,
    ...form,
  };
};
