import React from "react";
import Image from "next/image";
import CheckIcon from "@/assets/check-icon.svg";
import ArrowRightIcon from "@/components/general/icons/ArrowRightIcon";
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
        <h3 className="font-brand-heading text-center text-[1.75rem] font-medium">
          {title}
        </h3>
        <div className="font-brand-heading my-5 rounded-full border border-brand-1 px-2 py-[0.625rem] text-center text-[0.875rem] font-medium">
          {pricingDescription}
        </div>
        <div>
          <ul>
            {features.map((feature) => (
              <li
                key={nanoid()}
                className="my-10 flex items-center gap-[0.625rem]"
              >
                <Image src={CheckIcon} alt="Check" width="24" height="24" />
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
          "font-brand-heading flex h-[6.25rem] w-full items-center justify-center gap-5 border-r border-brand-3 bg-brand-1 text-center text-[1.125rem] text-brand-3",
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
