import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import useFetch from "@/components/hooks/useFetch";
import { supabaseStorage } from "@/utils/supabase";
import { useStoreSettings } from "./useStoreSettings";
import { CampaignInput } from "../types";
import { useRouter } from "next/router";
import { campaigns } from "@prisma/client";

const schema = yup
  .object({
    id: yup.string().optional(),
    title: yup.string().required("Please provide a title."),
    handle: yup.string().required("Please provide a handle."),
    description: yup.string().optional(),
    collectionIds: yup.array().of(yup.string()),
    productIds: yup.array().of(yup.string()),
    variantIds: yup.array().of(yup.string()),
    image: yup.string().optional(),
    password: yup.string().optional(),
    isActive: yup.boolean().default(false),
    cartTitle: yup.string().optional(),
    cartDescription: yup.string().optional(),
    cartItemsImageStyle: yup.string().optional(),
    cartCheckoutButtonStyle: yup.string().optional(),
    cartBackgroundColor: yup.string().optional(),
    cartTextColor: yup.string().optional(),
  })
  .required();

export const useCampaignForm = (campaign?: campaigns) => {
  const router = useRouter();
  const fetch = useFetch();
  const {
    settings: { shop },
  } = useStoreSettings();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [didSelectImageFile, setDidSelectImageFile] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(() => {
    if (!campaign) return "";
    const image = supabaseStorage.getPublicUrl(campaign.image);

    return image?.data.publicUrl ?? "";
  });
  const [imageFile, setImageFile] = useState<File>();

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    defaultValues: (campaign as any) || {
      collectionIds: [],
      productIds: [],
      variantIds: [],
      isActive: false,
    },
  });

  const { mutate: upsertCampaign } = useMutation<
    { campaign?: campaigns; error?: { code: string; message: string } },
    any,
    { data: CampaignInput }
  >(
    (variables) =>
      fetch("/api/apps/campaigns", {
        method: "POST",
        body: JSON.stringify(variables.data),
      }).then((response) => response.json()),
    {
      onSuccess: async (response) => {
        if (response.error || !response.campaign) {
          // TODO: Handle error state
          return;
        }

        const campaign = response.campaign;

        form.reset();
        setIsLoading(false);
        router.push(`/app/campaign/${campaign.id}`);
      },
    }
  );

  const onSubmit = handleSubmit(async (fields: CampaignInput, event) => {
    setIsLoading(true);

    if (imageFile) {
      // 1. Upload image
      const [shopId] = shop.split(".");
      const fileName = fields.handle;
      const [fileExt] = imageFile.name.split(".").reverse();

      const storageResponse = await supabaseStorage.upload(
        `${shopId}/${fileName}.${fileExt}`,
        imageFile,
        { upsert: true }
      );
      const image = storageResponse.data?.path ?? "";

      // 2. Upload data
      upsertCampaign({ data: { ...fields, image } });

      return;
    }

    upsertCampaign({ data: { ...fields } });
  });

  useEffect(() => {
    if (!imageFile && didSelectImageFile) {
      setImageUrl("");
      return;
    }

    if (imageFile) {
      setImageUrl(window.URL.createObjectURL(imageFile));
      setDidSelectImageFile(true);
    }
  }, [imageFile]);

  return {
    ...form,
    isLoading,
    imageUrl,
    imageFile,
    setImageFile,
    onSubmit,
    setCollectionIds: (type: CampaignInput["collectionIds"]) =>
      form.setValue("collectionIds", type),
    setProductIds: (ids: CampaignInput["productIds"]) =>
      form.setValue("productIds", ids),
    setVariantIds: (ids: CampaignInput["variantIds"]) =>
      form.setValue("variantIds", ids),
    setCartItemImageStyleValue: (style: CampaignInput["cartItemsImageStyle"]) =>
      form.setValue("cartItemImageStyle", style),
  };
};
