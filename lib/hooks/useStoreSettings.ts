import useFetch from "@/components/hooks/useFetch";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

export const useStoreSettings = () => {
  const fetch = useFetch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {
    data = { settings: { domain: null } },
    isLoading,
    refetch: refetchSettings,
  } = useQuery<{
    settings: { domain?: string };
  }>("settings", () =>
    fetch("/api/apps/settings").then((response) => response.json())
  );

  const { mutate: updateStoreDomain, isLoading: isUpdatingStoreDomain } =
    useMutation<
      {
        settings?: { domain?: string };
        error?: { code: string; message: string };
      },
      { error: { code: string; message: string } },
      { domain: string }
    >(
      (variables) =>
        fetch("/api/apps/settings", {
          method: "PUT",
          body: JSON.stringify(variables),
        }).then((response) => response.json()),
      {
        onSuccess: (data) => {
          if (data.error) {
            if (data.error.code === "UNAVAILABLE_DOMAIN")
              setErrors({ ...errors, [data.error.code]: data.error.message });
            return;
          }

          refetchSettings();
        },
      }
    );

  return {
    errors,
    isLoading,
    isUpdatingStoreDomain,
    settings: data.settings,
    updateStoreDomain,
  };
};
