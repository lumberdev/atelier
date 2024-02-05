import React from "react";
import Image from "next/image";
import AboutBackgroundImage from "@/assets/about-images.png";
import VerticalScrollingBanner from "./VerticalScrollingBanner";

const About = () => {
  return (
    <div className="flex h-screen w-full bg-brand-1">
      <div className="flex items-center justify-center px-20 text-brand-2 w-1/2">
        <div className="flex max-w-[37.6rem] flex-col gap-5">
          <h3 className="self-start text-[1.8rem] font-medium uppercase">
            Launch password protected mini-stores in a few clicks
          </h3>
          <div className="flex flex-col gap-[1.875rem] text-[1.75rem]">
            <p>
              Select any items or collections from your store (even draft
              products) and showcase them in an exclusive, password protected
              shopping experience separate from your main site.
            </p>
            <p>
              Retain full control over access, pricing, and promotions, and run
              as many sales simultaneously as you like.
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden flex justify-center items-center w-1/2">
        <VerticalScrollingBanner />
      </div>
    </div>
  );
};

export default About;
