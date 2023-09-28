import { useQuery } from "react-query";

export const useCampaignOnStore = ({ handle }) => {
  const { data = { campaign: {} }, isLoading } = useQuery<{
    campaign: any;
  }>(["campaign", handle], () =>
    fetch(`/api/campaign?handle=${handle}`).then((response) => response.json())
  );

  return {
    isLoading,
    campaign: data.campaign,
  };
};
