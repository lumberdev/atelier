import React from "react";
import Image from "next/image";
import AboutBackgroundImage from "@/assets/about-images.png";
import VerticalScrollingBanner from "./VerticalScrollingBanner";

const About = () => {
  return (
    <div className="flex md:h-screen w-full flex-col bg-brand-1 md:flex-row">
      <div className="flex items-center justify-center px-10 pb-16 pt-20 text-brand-2 md:w-1/2 md:px-20 md:py-0">
        <div className="flex max-w-[37.6rem] flex-col gap-5 ">
          <h3 className="self-start font-brand-heading text-sm font-medium uppercase md:text-lg">
            Launch password protected mini-stores in a few clicks
          </h3>
          <div className="flex flex-col gap-[1.875rem] font-brand-body text-2xl lg:text-[1.75rem]">
            <p className="font-light">
              Select any items or collections from your store (even draft
              products) and showcase them in an exclusive, password protected
              shopping experience separate from your main site.
            </p>
            <p className="font-light">
              Retain full control over access, pricing, and promotions, and run
              as many sales simultaneously as you like.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center overflow-hidden px-5 md:w-1/2 md:px-0">
        <VerticalScrollingBanner />
      </div>
    </div>
  );
};

export default About;
