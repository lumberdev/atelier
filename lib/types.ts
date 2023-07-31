export interface CampaignInput {
  id?: string;
  title: string;
  handle: string;
  description?: string;
  resourceType: "COLLECTIONS" | "PRODUCTS";
  resourceIds: string[];
  variantIds: string[];
  image?: string;
  isActive: boolean;
}
