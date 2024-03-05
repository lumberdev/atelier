import React from "react";
import Marquee from "react-fast-marquee";
import BannerText from "./BannerText";
import { PageHero } from "@/tina/__generated__/types";

interface ScrollingBannerProps {
  data: PageHero;
}

const ScrollingBanner = ({ data }: ScrollingBannerProps) => (
  <Marquee className="flex overflow-y-hidden border-y-2 border-brand-1 backdrop-blur-md">
    <BannerText data={data} />
    <BannerText data={data} />
    <BannerText data={data} />
    <BannerText data={data} />
  </Marquee>
);

export default ScrollingBanner;
