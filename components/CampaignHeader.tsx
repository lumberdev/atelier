import React from "react";
import Container from "./general/Container";

interface CampaignHeaderProps {
  campaignTitle?: string;
  campaignDescription?: string;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaignTitle,
  campaignDescription,
}) => {
  if (!campaignTitle && !campaignDescription) {
    return null;
  }

  return (
    <Container
      variant="lg"
      className="my-12 flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-[5rem]"
    >
      <h2 className="whitespace-nowrap text-[1.5rem] font-bold md:text-[2rem]">
        {campaignTitle}
      </h2>
      <p className="text-base md:text-lg">{campaignDescription}</p>
    </Container>
  );
};

export default CampaignHeader;
