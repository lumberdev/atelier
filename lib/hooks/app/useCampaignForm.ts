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
    id: yup.string().nullable(),
    isActive: yup.boolean().default(false),
    // STORE CUSTOMIZATION
    announcement: yup.string().nullable(),
    announcementBgColor: yup.string().nullable(),
    announcementTextColor: yup.string().nullable(),
    pageTitle: yup.string().nullable(),
    pageDescription: yup.string().nullable(),
    // CART CUSTOMIZATION
    cartTitle: yup.string().nullable(),
    cartDescription: yup.string().nullable(),
    cartItemsImageStyle: yup.string().nullable().oneOf(["round", "square"]),
    cartBackgroundColor: yup.string().nullable(),
    cartTextColor: yup.string().nullable(),
    // ACCESS CONTROL
    acpLayout: yup.string().nullable().oneOf(["DEFAULT", "STACKED"]),
    acpPassword: yup.string().nullable(),
    acpHeadline: yup.string().nullable(),
    acpBody: yup.string().nullable(),
    acpPasswordPlaceholder: yup.string().nullable(),
    acpCTAText: yup.string().nullable(),
    acpCTAUrl: yup.string().nullable(),
    acpBackgroundColor: yup.string().nullable(),
    acpBackgroundImage: yup.string().nullable(),
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
    return image?.data.publicUrl ? `${image?.data.publicUrl}?version=${Date.now()}` : "";
  });
  const [imageFile, setImageFile] = useState<File>();

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    /* Provide all default values so we can trigger the contextual save menu on value change */
    defaultValues: initialValues || {
      id: "",
      isActive: false,
      announcement: "",
      announcementBgColor: "",
      announcementTextColor: "",
      pageTitle: "",
      pageDescription: "",
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
        router.replace(router.asPath);
        setDidSelectImageFile(false);
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
        { upsert: true, cacheControl: '60' }
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
    setDidSelectImageFile
  };
};
