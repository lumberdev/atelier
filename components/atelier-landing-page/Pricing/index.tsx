import React from "react";
import PricingTier from "./PricingTier";

const DummyPricingDetails = [
  {
    id: 1,
    title: "FREE TRIAL",
    pricingDescription: "30-DAY FREE TRIAL",
    features: ["Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor"],
    url: "/",
  },
  {
    id: 2,
    title: "STARTER",
    pricingDescription: "30-DAY FREE TRIAL",
    features: [
      "Create up to 3 mini stores",
      "Basic customization options",
      "Atelier Logo in the footer",
    ],
    url: "/",
  },
  {
    id: 3,
    title: "PRO",
    pricingDescription: "30-DAY FREE TRIAL",
    features: [
      "Unlimited mini stores",
      "Unlimited mini stores",
      "Remove Atelier logo",
      "Access to exclusive templates",
      "Enhanced analytics for in-depth insights",
    ],
    url: "/",
  },
];

const Pricing = () => {
  return (
    <div id="pricing" className="flex items-stretch bg-brand-3">
      {DummyPricingDetails.map((pricingDetail) => (
        <PricingTier
          key={pricingDetail.id}
          pricingDetail={pricingDetail}
          isLastItem={pricingDetail.id === DummyPricingDetails.length}
        />
      ))}
    </div>
  );
};

export default Pricing;
