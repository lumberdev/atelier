import getMerchantTheme from "@/lib/merchant/getMerchantTheme";
import axios from "axios";
import { useQuery } from "react-query";

export const useTheme = () => {
  const {
    data = {
      global: {
        id: "",
        logo: "",
        backgroundColor: "",
        borderRadius: 0,
        logoPosition: "",
        primaryColor: "",
        secondaryColor: "",
      },
    },
    isLoading,
  } = useQuery<{
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
