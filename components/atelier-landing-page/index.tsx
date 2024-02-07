import React from "react";
import Navbar from "@/components/atelier-landing-page/Navbar";
import Hero from "@/components/atelier-landing-page/Hero";
import About from "@/components/atelier-landing-page/About";
import { cn } from "@/lib/utils";
import { tavirajFont, dmMonoFont } from "@/lib/fonts";

const AtelierLandingPage = () => {
  return (
    <div
      className={cn(
        dmMonoFont.variable,
        tavirajFont.variable,
        "relative h-screen"
      )}
    >
      <Navbar />
      <Hero />
      <About />
    </div>
  );
};

export default AtelierLandingPage;
