import { storeThemes } from "@prisma/client";
import axios from "axios";
import { useQuery } from "react-query";

export const useTheme = () => {
  const { data = { global: {} } } = useQuery<{ global: storeThemes }>({
    queryKey: "theme",
    queryFn: () => axios.get("/api/theme").then((response) => response.data),
  });

  return {
    global: data.global,
  };
};
