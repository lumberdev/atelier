import useFetch from "@/components/hooks/useFetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { AccessPageConfigInput } from "../types";
import { useEffect, useState } from "react";
import { supabaseStorage } from "@/utils/supabase";
import { useStoreSettings } from "./useStoreSettings";
import { accessPageConfig, campaigns } from "@prisma/client";

const schema = yup
  .object({
    id: yup.string().optional(),
    layout: yup.string().optional().oneOf(["DEFAULT", "STACKED"]),
    password: yup.string().optional(),
    headline: yup.string().optional().required(),
    body: yup.string().optional(),
    passwordPlaceholder: yup.string().optional(),
    ctaText: yup.string().optional(),
    ctaUrl: yup.string().optional(),
    backgroundColor: yup.string().optional(),
    backgroundImage: yup.string().optional(),
  })
  .required();

export const useCampaignAccessControlForm = ({
  campaign,
  onSuccess = () => {},
}: {
  campaign: campaigns;
  onSuccess?: () => void;
}) => {
  const fetch = useFetch();
  const {
    settings: { shop },
  } = useStoreSettings();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Background image
  const [didSelectImageFile, setDidSelectImageFile] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();

  useEffect(() => {
    if (!imageFile && didSelectImageFile) {
      setImageUrl("");
      form.setValue("backgroundImage", "");
      return;
    }

    if (imageFile) {
      setImageUrl(window.URL.createObjectURL(imageFile));
      setDidSelectImageFile(true);
    }
  }, [imageFile]);

  // Form
  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      layout: "DEFAULT",
    },
  });

  // Mount-hook
  const { data: campaignACConfig } = useQuery<{ config: accessPageConfig }>({
    enabled: !!campaign?.id,
    queryKey: ["access-control-config", campaign?.id],
    queryFn: () =>
      fetch(`/api/apps/access-control/${campaign?.id}`).then((response) =>
        response.json()
      ),
    onSuccess: (response) => {
      if (!response?.config || form.getValues("id")) return;

      const config = response?.config;

      if (form.getValues("id")) return;

      form.setValue("id", config.id);
      form.setValue("layout", config.layout);
      form.setValue("headline", config.headline);
      form.setValue("body", config.body);
      form.setValue("password", config.password);
      form.setValue("passwordPlaceholder", config.passwordPlaceholder);

      form.setValue("backgroundColor", config.backgroundColor);

      if (config.backgroundImage) {
        const image = supabaseStorage.getPublicUrl(config.backgroundImage);

        setImageUrl(image?.data.publicUrl ?? "");
        form.setValue("backgroundImage", config.backgroundImage);
        setDidSelectImageFile(true);
      }

      form.setValue("ctaText", config.ctaText);
      form.setValue("ctaUrl", config.ctaUrl);
    },
  });

  // Mutation
  const { mutate: upsertAccessControlConfig } = useMutation<
    {},
    any,
    { data: AccessPageConfigInput }
  >(
    (variables) =>
      fetch(`/api/apps/access-control`, {
        method: "POST",
        body: JSON.stringify(variables.data),
      }),
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const onSubmit = handleSubmit(async (fields: AccessPageConfigInput) => {
    setIsLoading(true);

    if (imageFile) {
      // 1. Upload image
      const [shopId] = shop.split(".");
      const fileName = `${campaign.handle}-access-page`;
      const [fileExt] = imageFile.name.split(".").reverse();

      const storageResponse = await supabaseStorage.upload(
        `${shopId}/${fileName}.${fileExt}`,
        imageFile,
        { upsert: true }
      );
      const image = storageResponse.data?.path ?? "";

      // 2. Upload data
      upsertAccessControlConfig({
        data: { ...fields, campaignId: campaign.id, backgroundImage: image },
      });

      return;
    }

    upsertAccessControlConfig({ data: { ...fields, campaignId: campaign.id } });
  });

  return {
    ...form,
    isLoading,
    imageUrl,
    imageFile,
    setImageFile,
    onSubmit,
  };
};
