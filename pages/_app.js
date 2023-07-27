import { NavigationMenu } from "@shopify/app-bridge-react";
import { Frame, AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/utils/queryClient";
import "./global.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider>
        <NavigationMenu
          navigationLinks={[
            {
              label: "Settings",
              destination: "/settings",
            },
          ]}
          matcher={(link) => router.pathname === link.destination}
        />

        <QueryClientProvider client={queryClient}>
          <Frame>
            <Component {...pageProps} />
          </Frame>
        </QueryClientProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}
