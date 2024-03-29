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
    logo: yup.string().optional(),
    primaryColor: yup.string().optional(),
    secondaryColor: yup.string().optional(),
    backgroundColor: yup.string().optional(),
    borderRadius: yup.string().optional(),
    logoPosition: yup.string().optional(),
  })
  .required();

export const useStoreThemeForm = ({
  logo,
  onUpsert = () => {},
}: {
  logo?: string;
  onUpsert?: () => void;
}) => {
  const router = useRouter();
  const fetch = useFetch();
  const {
    settings: { shop },
  } = useStoreSettings();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoPath, setLogoPath] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    if (!logo) return "";
    const image = supabaseStorage.getPublicUrl(logo);

    return image?.data.publicUrl ?? "";
  });

  const [didSelectImageFile, setDidSelectImageFile] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File>();
  const [merchantThemeSettings, setMerchantThemeSettings] = useState([]);

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

  const { data = { theme: {} } } = useQuery<{ theme: storeThemes, theme_config_filtered: object[] }>({
    queryKey: "theme",
    queryFn: () =>
      fetch("/api/apps/settings/themeconfig").then((response) => response.json()),
    onSuccess: (response) => {
      if (!response.theme?.id || form.getValues("id")) return;
      const theme = response.theme;
      setMerchantThemeSettings(response.theme_config_filtered);

      form.setValue("id", theme.id);
      if (theme.primaryColor) form.setValue("primaryColor", theme.primaryColor);
      if (theme.secondaryColor)
        form.setValue("secondaryColor", theme.secondaryColor);
      if (theme.backgroundColor)
        form.setValue("backgroundColor", theme.backgroundColor);
      if (theme.borderRadius !== null)
        form.setValue("borderRadius", theme.borderRadius + "");
      if (theme.logoPosition) form.setValue("logoPosition", theme.logoPosition);

      if (theme.logo) {
        const url = supabaseStorage.getPublicUrl(theme.logo);
        setLogoPath(theme.logo);
        setLogoUrl(url.data.publicUrl ? `${url.data.publicUrl}?version=${Date.now()}` : "");
      }
    },
  });

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!imageFile && didSelectImageFile) {
      setLogoUrl("");
      return;
    }

    if (imageFile) {
      setLogoUrl(window.URL.createObjectURL(imageFile));
      setDidSelectImageFile(true);
    }
  }, [imageFile]);

  const onSubmit = handleSubmit(async (fields) => {
    setIsLoading(true);

    if (imageFile) {
      // 1. Upload image
      const [shopId] = shop.split(".");
      const fileName = "logo";
      const [fileExt] = imageFile.name.split(".").reverse();

      const storageResponse = await supabaseStorage.upload(
        `${shopId}/${fileName}.${fileExt}`,
        imageFile,
        { upsert: true, cacheControl: '60' }
      );
      const logo = storageResponse.data?.path ?? "";

      // 2. Upload data
      upsertTheme({
        data: {
          ...fields,
          logo,
          borderRadius: Number(fields.borderRadius) || 0,
        },
      });
      return;
    }

    upsertTheme({
      data: { 
        ...fields, 
        logo: logoUrl ? logoPath : "", 
        borderRadius: Number(fields.borderRadius) || 0 
      },
    });
  });

  return {
    logoUrl,
    imageFile,
    setImageFile,
    setLogoUrl,
    onSubmit,
    isLoading,
    merchantThemeSettings,
    ...form,
  };
};
