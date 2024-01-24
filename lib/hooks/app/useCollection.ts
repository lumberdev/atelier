import useFetch from "@/components/hooks/useFetch";
import { CampaignCollection } from "@/lib/types";
import { useQuery } from "react-query";

const useCollection = (id: string) => {
  const fetch = useFetch();

  const { data, isLoading } = useQuery<any, any, CampaignCollection>({
    enabled: !!id,
    queryKey: ["collection", id],
    queryFn: () =>
      fetch(`/api/apps/collection/${id}`).then((response) => response.json()),
  });

  return {
    isLoading,
    ...data,
  };
};

export default useCollection;
