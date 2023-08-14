import { useQuery } from "react-query";

export const useCampaignOnSite = ({ campaign_handle }) => {
  const { data = { campaign: {} }, isLoading } = useQuery<{
    campaign: any;
  }>(["campaign", campaign_handle], () =>
    fetch(`/api/campaign?campaign_handle=${campaign_handle}`).then((response) =>
      response.json()
    )
  );

  return {
    isLoading,
    campaign: data.campaign,
  };
};
