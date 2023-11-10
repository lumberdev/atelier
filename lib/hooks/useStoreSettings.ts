import useFetch from "@/components/hooks/useFetch";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

export const useStoreSettings = () => {
  const fetch = useFetch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {
    data = { settings: { shop: null, domain: null } },
    isLoading,
    refetch: refetchSettings,
  } = useQuery<{
    settings: { shop: string; domain?: string };
  }>(
    "settings",
    () => fetch("/api/apps/settings").then((response) => response.json()),
    {
      onSuccess: () => {
        setErrors({});
      },
    }
  );

  const { mutate: updateStoreDomain, isLoading: isUpdatingStoreDomain } =
    useMutation<
      {
        settings?: { shop: string; domain?: string };
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
