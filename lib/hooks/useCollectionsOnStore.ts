import { useQuery } from "react-query";

// Takes an array of collection_ids as an argument
export const useCollectionsOnStore = ({ store_id, collection_ids }) => {
  const { data = { collections: [] }, isLoading } = useQuery<{
    collections: any[];
  }>(
    ["collections", store_id, collection_ids],
    () =>
      fetch(
        `/api/collections?store_id=${store_id}&collection_ids=${collection_ids}`
      ).then((response) => response.json()),
    {
      enabled: !!store_id && collection_ids.length > 0,
    }
  );

  return {
    isLoading,
    collections: data.collections,
  };
};
