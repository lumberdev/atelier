import React from "react";
import CheckIcon from "@/assets/icons/check-icon.svg";
import ArrowRightIcon from "@/components/atelier-landing-page/general/ArrowRightIcon";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

interface PricingTierProps {
  isLastItem: boolean;
  pricingDetail: {
    title: string;
    pricingDescription: string;
    features: string[];
    url: string;
  };
}

const PricingTier = ({
  isLastItem,
  pricingDetail: { title, pricingDescription, features, url },
}: PricingTierProps) => {
  return (
    <div className="flex flex-1 flex-col justify-between">
      <div
        className={cn(
          "flex-1  border-r border-brand-1 px-10 pt-10 ",
          isLastItem && "border-r-0"
        )}
      >
        <h3 className="text-center font-brand-heading text-[1.75rem] font-medium">
          {title}
        </h3>
        <div className="my-5 rounded-full border border-brand-1 px-2 py-[0.625rem] text-center font-brand-heading text-[0.875rem] font-medium">
          {pricingDescription}
        </div>
        <div>
          <ul>
            {features.map((feature) => (
              <li
                key={nanoid()}
                className="my-10 flex items-center gap-[0.625rem]"
              >
                <CheckIcon width={24} height={25} />
                <span className="font-brand-body text-[1.125rem]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        className={cn(
          "flex h-[6.25rem] w-full items-center justify-center gap-5 border-r border-brand-3 bg-brand-1 text-center font-brand-heading text-[1.125rem] text-brand-3",
          isLastItem && "border-r-0"
        )}
      >
        <span>TRY IT FOR FREE</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
};

export default PricingTier;
