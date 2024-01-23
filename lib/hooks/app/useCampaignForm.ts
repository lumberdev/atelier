import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useMutation } from "react-query";
import useFetch from "@/components/hooks/useFetch";
import { CampaignInput } from "../../types";
import { useRouter } from "next/router";
import { campaigns } from "@prisma/client";

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
  })
  .required();

export const useCampaignForm = (campaign?: campaigns) => {
  const router = useRouter();
  const fetch = useFetch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleSubmit, ...form } = useForm({
    resolver: yupResolver(schema),
    defaultValues: (campaign as any) || {
      id: "",
      isActive: false,
      announcement: "",
      cartTitle: "",
      cartDescription: "",
      cartItemsImageStyle: "round",
      cartBackgroundColor: "",
      cartTextColor: "",
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

        setIsLoading(false);
        router.push(`/app/campaign/${campaign.id}`);
      },
    }
  );

  const onSubmit = handleSubmit(async (fields: CampaignInput, event) => {
    console.log("[AT]", fields);
    // setIsLoading(true);

    // upsertCampaign({ data: { ...fields } });
  });

  return {
    ...form,
    isLoading,
    onSubmit,
  };
};
