import React from "react";
import Hero from "@/components/atelier-landing-page/Hero";
import About from "@/components/atelier-landing-page/About";
import ValueProps from "@/components/atelier-landing-page/ValueProps";
import Pricing from "@/components/atelier-landing-page/Pricing";
import Layout from "@/components/atelier-landing-page/general/Layout";
import { Page } from "@/tina/__generated__/types";

interface AtelierLandingPageProps {
  data?: Page;
}

const AtelierLandingPage = ({ data }: AtelierLandingPageProps) => {
  const { hero, about, valueProps, pricings } = data || {};
  return (
    <Layout>
      <Hero data={hero} />
      <About data={about} />
      <ValueProps data={valueProps} />
      <Pricing data={pricings} />
    </Layout>
  );
};

export default AtelierLandingPage;
