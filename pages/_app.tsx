import { Frame, AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/utils/queryClient";
import BillingProvider from "@/context/BillingProvider";
import Navigation from "@/components/Navigation";
import CartProvider from "@/context/CartProvider";
import ThemeProvider from "@/context/ThemeProvider";
import PreviewModeBanner from "@/components/PreviewModeBanner";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ATELIER SHOPIFY APP
  if (
    router.pathname.indexOf("/app") === 0 ||
    router.pathname.indexOf("/exitframe") === 0
  ) {
    import("./global.css" as any);

    return (
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          <Navigation />

          <QueryClientProvider client={queryClient}>
            <BillingProvider>
              <Frame>
                <Component {...pageProps} />
              </Frame>
            </BillingProvider>
          </QueryClientProvider>
        </AppBridgeProvider>
      </PolarisProvider>
    );
  }

  // ATELIER WEBSITE
  import("./site-global.css" as any);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={pageProps.themeConfig}>
        <CartProvider
          shop={pageProps.shop}
          storefrontAccessToken={pageProps.storefrontAccessToken}
        >
          <Component {...pageProps} />

          {pageProps.previewMode && <PreviewModeBanner />}
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
