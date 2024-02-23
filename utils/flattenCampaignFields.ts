import { CampaignFlatFields, CampaignQueryFields } from "@/lib/types";

const flattenCampaignFields = (
  campaign: CampaignQueryFields
): CampaignFlatFields => {
  const fields: CampaignFlatFields = {
    id: campaign.id,
    isActive: campaign.isActive,
    announcement: campaign.announcement,
    pageTitle: campaign.pageTitle,
    pageDescription: campaign.pageDescription,
    cartTitle: campaign.cartTitle,
    cartDescription: campaign.cartDescription,
    cartItemsImageStyle: campaign.cartItemsImageStyle,
    cartBackgroundColor: campaign.cartBackgroundColor,
    cartTextColor: campaign.cartTextColor,
    acpLayout: campaign.accessPageConfig.layout,
    acpPassword: campaign.accessPageConfig.password,
    acpHeadline: campaign.accessPageConfig.headline,
    acpBody: campaign.accessPageConfig.body,
    acpPasswordPlaceholder: campaign.accessPageConfig.passwordPlaceholder,
    acpCTAText: campaign.accessPageConfig.ctaText,
    acpCTAUrl: campaign.accessPageConfig.ctaUrl,
    acpBackgroundColor: campaign.accessPageConfig.backgroundColor,
    acpBackgroundImage: campaign.accessPageConfig.backgroundImage,
    previewToken: campaign.previewToken,
  };

  return fields;
};

export default flattenCampaignFields;
