import { useQuery } from "react-query";

// Takes an array of collection_ids as an argument
export const useCollectionsOnStore = ({ store_id, collection_ids }) => {
  const { data = { collections: [] }, isLoading } = useQuery<{
    collections: any[];
  }>(
    ["collections", store_id, collection_ids],
    async () => {
      const params = new URLSearchParams({ store_id, collection_ids });
      const response = await fetch(`/api/collections?${params.toString()}`);
      return await response.json();
    },
    {
      enabled: !!store_id && collection_ids.length > 0,
    }
  );

  return {
    isLoading,
    collections: data.collections,
  };
};
