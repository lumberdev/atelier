import useFetch from "@/components/hooks/useFetch";
import { PublicationCollectionListing } from "@/lib/types";
import { useQuery } from "react-query";

const usePublication = () => {
  const fetch = useFetch();

  const {
    data = {
      listing: [],
    },
    isLoading,
  } = useQuery<any, any, { listing: PublicationCollectionListing }>({
    queryKey: "publication",
    queryFn: () =>
      fetch("/api/apps/publication").then((response) => response.json()),
    onSuccess: (response) => {
      console.log("[AT] usePublication ::", { response });
    },
  });

  return { ...data, isLoading };
};

export default usePublication;