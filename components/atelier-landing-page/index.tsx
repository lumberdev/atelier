import React from "react";
import Navbar from "@/components/atelier-landing-page/Navbar";
import Hero from "@/components/atelier-landing-page/Hero";
import About from "@/components/atelier-landing-page/About";

const AtelierLandingPage = () => {
  return (
    <div className="relative h-screen">
      <Navbar />
      <Hero />
      <About />
    </div>
  );
};

export default AtelierLandingPage;
