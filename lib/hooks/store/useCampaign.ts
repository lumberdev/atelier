import { useQuery } from "react-query";

export const useCampaign = ({ handle }) => {
  const { data = { campaign: {} }, isLoading } = useQuery<{
    campaign: any;
  }>(["campaign", handle], async () => {
    const params = new URLSearchParams({ handle });
    const response = await fetch(`/api/campaign?${params.toString()}`);
    return await response.json();
  });
  return {
    isLoading,
    campaign: data.campaign,
  };
};
