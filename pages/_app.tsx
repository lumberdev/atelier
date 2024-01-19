import {
  NavigationMenu,
  RoutePropagator,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { Frame, AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/utils/queryClient";
import { CartProvider } from "@/context/CartContext";
import SlidingCart from "@/components/cart/SlidingCart";
import BillingProvider from "@/context/BillingProvider";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ATELIER SHOPIFY APP
  if (
    router.pathname.indexOf("/app") === 0 ||
    router.pathname.indexOf("/exitframe") === 0
  ) {
    import("./global.css" as any);
    import("@shopify/polaris/build/esm/styles.css" as any);

    return (
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          {/* <NavigationMenu
            navigationLinks={[
              {
                label: "Settings",
                destination: "/app/settings",
              },
            ]}
            matcher={(link, location) => {
              console.log("[AT]", { link, location });
              return location.search === link.destination;
            }}
          /> */}

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
