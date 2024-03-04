import React from "react";
import PricingTier from "./PricingTier";
import { PagePricings } from "@/tina/__generated__/types";

export interface PricingProps {
  data: PagePricings;
}

const Pricing = ({ data }: PricingProps) => {
  return (
    <div
      id="pricing"
      className="flex flex-col items-stretch gap-10 bg-brand-3 px-10 py-16 md:flex-row md:gap-0 md:p-0"
    >
      {data?.pricing?.map((pricingDetail, idx) => (
        <PricingTier
          key={pricingDetail.title}
          pricingDetail={pricingDetail}
          isLastItem={idx === data.pricing.length - 1}
        />
      ))}
    </div>
  );
};

export default Pricing;
