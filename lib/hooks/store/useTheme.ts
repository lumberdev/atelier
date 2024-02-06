import getMerchantTheme from "@/lib/merchant/getMerchantTheme";
import axios from "axios";
import { useQuery } from "react-query";

export const useTheme = () => {
  const { data = { global: {} }, isLoading } = useQuery<{
    global: Awaited<ReturnType<typeof getMerchantTheme>>;
  }>({
    queryKey: "theme",
    queryFn: () => axios.get("/api/theme").then((response) => response.data),
  });

  return {
    global: data.global,
    isLoading,
  };
};
