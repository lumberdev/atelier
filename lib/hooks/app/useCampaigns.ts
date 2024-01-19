import useFetch from "@/components/hooks/useFetch";
import { campaigns as Campaigns } from "@prisma/client";
import { useMutation, useQuery } from "react-query";

export const useCampaigns = () => {
  const fetch = useFetch();

  const {
    data = { identifier: "", campaigns: [], availableProductCount: 0 },
    isLoading,
    refetch: refetchCampaigns,
  } = useQuery<{
    identifier?: string;
    campaigns: Campaigns[];
    availableProductCount: number;
  }>("campaigns", () =>
    fetch("/api/apps/campaigns").then((response) => response.json())
  );

  const { mutate: unpublishCampaigns } = useMutation<
    any,
    any,
    { ids: string[] }
  >({
    mutationFn: (variables) =>
      fetch(`/api/apps/campaigns/bulk`, {
        method: "PUT",
        body: JSON.stringify({
          ids: variables.ids,
          input: { isActive: false },
        }),
      }).then((response) => response.json()),
    onSuccess: (response) => {
      if (response.error) {
        // TODO: Handle error state
        return;
      }

      refetchCampaigns();
    },
  });

  const { mutate: publishCampaigns } = useMutation<any, any, { ids: string[] }>(
    {
      mutationFn: (variables) =>
        fetch(`/api/apps/campaigns/bulk`, {
          method: "PUT",
          body: JSON.stringify({
            ids: variables.ids,
            input: { isActive: true },
          }),
        }).then((response) => response.json()),
      onSuccess: (response) => {
        if (response.error) {
          // TODO: Handle error state
          return;
        }

        refetchCampaigns();
      },
    }
  );

  const { mutate: deleteCampaigns } = useMutation<any, any, { ids: string[] }>({
    mutationFn: (variables) =>
      fetch(`/api/apps/campaigns/bulk`, {
        method: "DELETE",
        body: JSON.stringify({
          ids: variables.ids,
        }),
      }),
    onSuccess: (response) => {
      if (response.error) {
        return;
      }

      refetchCampaigns();
    },
  });

  return {
    isLoading,
    identifier: data.identifier,
    campaigns: data.campaigns,
    availableProductCount: data.availableProductCount,
    unpublishCampaigns,
    publishCampaigns,
    deleteCampaigns,
  };
};
