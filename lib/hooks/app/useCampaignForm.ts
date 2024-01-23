import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import useFetch from "@/components/hooks/useFetch";
import { CampaignInput } from "../../types";
import { useRouter } from "next/router";
import { campaigns } from "@prisma/client";
import { useStoreSettings } from "./useStoreSettings";
import { supabaseStorage } from "@/utils/supabase";

const schema = yup
  .object({
    // CAMPAIGN DETAILS
    id: yup.string().optional(),
    isActive: yup.boolean().default(false),
    // STORE CUSTOMIZATION
    announcement: yup.string().optional(),
    // CART CUSTOMIZATION
    cartTitle: yup.string().optional(),
    cartDescription: yup.string().optional(),
    cartItemsImageStyle: yup.string().optional().oneOf(["round", "square"]),
    cartBackgroundColor: yup.string().optional(),
    cartTextColor: yup.string().optional(),
    // ACCESS CONTROL
    acpLayout: yup.string().optional().oneOf(["DEFAULT", "STACKED"]),
    acpPassword: yup.string().optional(),
    acpHeadline: yup.string().optional().required(),
    acpBody: yup.string().optional(),
    acpPasswordPlaceholder: yup.string().optional(),
    acpCTAText: yup.string().optional(),
    acpCTAUrl: yup.string().optional(),
    acpBackgroundColor: yup.string().optional(),
    acpBackgroundImage: yup.string().optional(),
  })
  .required();

type UseCampaignFormProps =
  | { campaign: campaigns; handle?: never; collectionId?: never }
  | { campaign?: never; handle: string; collectionId: string };

export const useCampaignForm = ({
  campaign,
  handle,
  collectionId,
}: UseCampaignFormProps) => {
  const router = useRouter();
  const fetch = useFetch();
  const {
    settings: { shop },
  } = useStoreSettings();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Background image
  const [didSelectImageFile, setDidSelectImageFile] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    /* Provide all default values so we can trigger the contextual save menu on value change */
    defaultValues: (campaign as any) || {
      id: "",
      isActive: false,
      announcement: "",
      cartTitle: "",
      cartDescription: "",
      cartItemsImageStyle: "round",
      cartBackgroundColor: "",
      cartTextColor: "",
      acpLayout: "DEFAULT",
      acpPassword: "",
      acpHeadline: "",
      acpBody: "",
      acpPasswordPlaceholder: "",
      acpCTAText: "",
      acpCTAUrl: "",
      acpBackgroundColor: "",
      acpBackgroundImage: "",
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
        body: JSON.stringify({
          ...variables.data,
          handle: campaign ? campaign.handle : handle,
          collectionId: campaign ? campaign.collectionId : collectionId,
        }),
      }).then((response) => response.json()),
    {
      onSuccess: async (response) => {
        if (response.error || !response.campaign) {
          // TODO: Handle error state
          return;
        }

        const campaign = response.campaign;

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
      const fileName = `${campaign ? campaign.handle : handle}-access-page`;
      const [fileExt] = imageFile.name.split(".").reverse();

      const storageResponse = await supabaseStorage.upload(
        `${shopId}/${fileName}.${fileExt}`,
        imageFile,
        { upsert: true }
      );
      const image = storageResponse.data?.path ?? "";

      upsertCampaign({ data: { ...fields, acpBackgroundImage: image } });
      return;
    }

    upsertCampaign({ data: { ...fields } });
  });

  useEffect(() => {
    if (!imageFile && didSelectImageFile) {
      setImageUrl("");
      form.setValue("acpBackgroundImage", "");
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
    onSubmit,
    didSelectImageFile,
    imageUrl,
    imageFile,
    setImageFile,
  };
};
