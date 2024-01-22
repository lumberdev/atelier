import useFetch from "@/components/hooks/useFetch";
import { useQuery } from "react-query";

const useShop = () => {
  const fetch = useFetch();

  const {
    data = {
      id: "",
      domain: "",
      appHandle: "",
      publicationId: "",
      availableProductCount: 0,
      availableCollectionCount: 0,
    },
    isLoading,
  } = useQuery<
    {},
    any,
    {
      id: string;
      domain: string;
      appHandle: string;
      publicationId: string;
      availableProductCount: number;
      availableCollectionCount: number;
    }
  >({
    queryKey: "shop",
    queryFn: () => fetch("/api/apps/shop").then((response) => response.json()),
    onSuccess: (response) => {},
  });

  return { ...data, isLoading };
};

export default useShop;
