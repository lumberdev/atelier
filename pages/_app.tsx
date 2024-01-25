import { Frame, AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/utils/queryClient";
import { CartProvider } from "@/context/CartContext";
import SlidingCart from "@/components/cart/SlidingCart";
import BillingProvider from "@/context/BillingProvider";
import Navigation from "@/components/Navigation";
import AtelierLandingPage from "@/components/atelier-landing-page";
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname.indexOf("/") === 0) {
    import("./atelier-landing-page-global.css" as any);
    return (
      <NextUIProvider>
        <AtelierLandingPage />
      </NextUIProvider>
    );
  }

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
      <CartProvider>
        <Component {...pageProps} />
        <SlidingCart />
      </CartProvider>
    </QueryClientProvider>
  );
}
