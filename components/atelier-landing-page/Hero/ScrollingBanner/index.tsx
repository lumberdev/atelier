import React from "react";
import Marquee from "react-fast-marquee";
import BannerText from "./BannerText";

const ScrollingBanner = () => (
  <Marquee className="flex overflow-y-hidden border-y-2 border-brand-1 backdrop-blur-md">
    <BannerText />
    <BannerText />
    <BannerText />
    <BannerText />
  </Marquee>
);

export default ScrollingBanner;
