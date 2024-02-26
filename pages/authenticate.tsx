import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const Authenticate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    token,
    store: storeId,
    campaign: campaignHandle,
  } = Object.fromEntries(searchParams);

  useEffect(() => {
    const authenticateUser = async () => {
      if (token && storeId && campaignHandle) {
        try {
          const response = await axios.post(
            "/api/auth/authenticateStytchToken",
            {
              token,
              storeId,
              campaignHandle,
            }
          );
          const { redirectUrl } = response.data;
          router.replace(redirectUrl);
        } catch (error) {
          console.error("Authentication error:", error);
          // Handle error (e.g., display an error message to the user)
        }
      }
    };

    authenticateUser();
  }, [token, storeId, campaignHandle, router]);

  return <div>Authenticating...</div>;
};

export default Authenticate;
