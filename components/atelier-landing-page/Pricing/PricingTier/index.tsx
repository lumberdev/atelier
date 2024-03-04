import React from "react";
import CheckIcon from "@/assets/icons/check-icon.svg";
import ArrowRightIcon from "@/components/atelier-landing-page/general/ArrowRightIcon";
import { nanoid } from "nanoid";
import Link from "next/link";
import classNames from "classnames";

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
    <div className="flex flex-1 flex-col justify-between border border-brand-1 bg-brand-3 md:rounded-none md:border-0 md:bg-transparent">
      <div
        className={classNames(
          "flex-1 border-brand-1 px-10 pt-10 md:border-r md:px-6 lg:px-10",
          isLastItem && "md:border-r-0"
        )}
      >
        <h3 className="text-center font-brand-heading text-2xl font-medium md:text-[1.75rem]">
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
                <span className="font-brand-body text-lg md:text-base lg:text-lg">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link
        href="https://apps.shopify.com"
        target="_blank"
        className={classNames(
          "flex h-[5rem] w-full items-center justify-center gap-5 border-brand-3 bg-brand-1 text-center font-brand-heading text-base text-brand-3 md:h-[6.25rem] md:border-b md:border-r lg:text-[1.125rem]",
          isLastItem && "md:border-r-0"
        )}
      >
        <span>TRY IT FOR FREE</span>
        <ArrowRightIcon />
      </Link>
    </div>
  );
};

export default PricingTier;
