import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import useFetch from "@/components/hooks/useFetch";
import { CampaignFlatFields } from "../../types";
import { useRouter } from "next/router";
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

type UseCampaignFormProps = {
  initialValues?: CampaignFlatFields;
  handle: string;
  collectionId: string;
  onCreate?: (campaign: CampaignFlatFields) => void;
  onUpdate?: () => void;
};

export const useCampaignForm = ({
  initialValues,
  handle,
  collectionId,
  onCreate = () => {},
  onUpdate = () => {},
}: UseCampaignFormProps) => {
  const router = useRouter();
  const fetch = useFetch();
  const {
    settings: { shop },
  } = useStoreSettings();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Background image
  const [didSelectImageFile, setDidSelectImageFile] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(() => {
    if (!initialValues) return "";

    const image = supabaseStorage.getPublicUrl(
      initialValues.acpBackgroundImage
    );
    return image?.data.publicUrl ?? "";
  });
  const [imageFile, setImageFile] = useState<File>();

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    /* Provide all default values so we can trigger the contextual save menu on value change */
    defaultValues: initialValues || {
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
    {
      campaign?: CampaignFlatFields;
      error?: { code: string; message: string };
    },
    any,
    { data: CampaignFlatFields }
  >(
    (variables) =>
      fetch("/api/apps/campaigns", {
        method: "POST",
        body: JSON.stringify({
          ...variables.data,
          handle,
          collectionId,
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

        if (!initialValues?.id) return onCreate(campaign);

        onUpdate();
        form.reset(campaign);
      },
    }
  );

  const onSubmit = handleSubmit(async (fields: CampaignFlatFields, event) => {
    setIsLoading(true);

    if (imageFile) {
      // 1. Upload image
      const [shopId] = shop.split(".");
      const fileName = `${handle}-access-page`;
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
