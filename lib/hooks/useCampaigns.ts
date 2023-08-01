import useFetch from "@/components/hooks/useFetch";
import { campaigns as Campaigns } from "@prisma/client";
import { useQuery } from "react-query";

export const useCampaigns = () => {
  const fetch = useFetch();

  const { data = { identifier: "", campaigns: [] }, isLoading } = useQuery<{
    identifier?: string;
    campaigns: Campaigns[];
  }>("campaigns", () =>
    fetch("/api/apps/campaigns").then((response) => response.json())
  );

  return {
    isLoading,
    identifier: data.identifier,
    campaigns: data.campaigns,
  };
};
