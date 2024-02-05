import AtelierLandingPage from "@/components/atelier-landing-page";
import { NextUIProvider } from "@nextui-org/react";

const HomePage = () => {
  return (
    <NextUIProvider>
      <AtelierLandingPage />
    </NextUIProvider>
  );
};

export default HomePage;
