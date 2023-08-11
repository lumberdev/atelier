import useFetch from "@/components/hooks/useFetch";
import { useQuery } from "react-query";

export const useProducts = () => {
  const fetch = useFetch();

  const { data = { identifier: "", products: [] }, isLoading } = useQuery<{
    identifier?: string;
    products: any[];
  }>("products", () =>
    fetch("/api/apps/products").then((response) => response.json())
  );

  return {
    isLoading,
    identifier: data.identifier,
    products: data.products,
  };
};
