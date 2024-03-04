import React from "react";
import Hero from "@/components/atelier-landing-page/Hero";
import About from "@/components/atelier-landing-page/About";
import ValueProps from "@/components/atelier-landing-page/ValueProps";
import Pricing from "@/components/atelier-landing-page/Pricing";
import Layout from "@/components/atelier-landing-page/general/Layout";

const AtelierLandingPage = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <ValueProps />
      <Pricing />
    </Layout>
  );
};

export default AtelierLandingPage;
