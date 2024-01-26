import useFetch from "@/components/hooks/useFetch";
import { CampaignCollection } from "@/lib/types";
import { useState } from "react";
import { useQuery } from "react-query";

const useCollection = (id: string) => {
  const [pagination, setPagination] = useState<string>("");
  const fetch = useFetch();

  const { data, isLoading } = useQuery<any, any, CampaignCollection>({
    enabled: !!id,
    queryKey: ["collection", id, pagination],
    queryFn: () =>
      fetch(`/api/apps/collection/${id}?${pagination}`).then((response) =>
        response.json()
      ),
  });

  const goToNextPage = () => {
    const params = new URLSearchParams({
      after: data.products.pageInfo.endCursor,
    });

    setPagination(params.toString());
  };

  const goToPreviousPage = () => {
    const params = new URLSearchParams({
      before: data.products.pageInfo.startCursor,
    });

    setPagination(params.toString());
  };

  return {
    isLoading,
    goToNextPage,
    goToPreviousPage,
    ...data,
  };
};

export default useCollection;
