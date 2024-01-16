import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
interface UseDraftCampaignProps {
  previewToken: string;
  isCampaignActive: boolean;
}

function useDraftCampaign({
  previewToken,
  isCampaignActive,
}: UseDraftCampaignProps) {
  const [showNotFoundPage, setShowNotFoundPage] = useState(false);
  const searchParams = useSearchParams();
  const queryPreviewToken = searchParams.get("preview_token");
  const router = useRouter();
  useEffect(() => {
    if (queryPreviewToken && queryPreviewToken === previewToken) {
      localStorage.setItem("preview_token", queryPreviewToken);
      // delete the query param from the url
      const { pathname, query } = router;
      delete query.preview_token;
      router.replace({
        pathname,
        query,
      });
    }
    const timeoutId = setTimeout(
      () => {
        localStorage.removeItem("preview_token");
      },
      30 * 60 * 1000
    ); // 30 minutes in milliseconds
    return () => clearTimeout(timeoutId);
  }, [queryPreviewToken, previewToken]);

  useEffect(() => {
    if (!isCampaignActive && !localStorage.getItem("preview_token")) {
      setShowNotFoundPage(true);
    }
  }, [isCampaignActive]);

  return { showNotFoundPage };
}

export default useDraftCampaign;
