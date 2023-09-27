export interface CampaignInput {
  id?: string;
  title: string;
  handle: string;
  description?: string;
  collectionIds: string[];
  productIds: string[];
  variantIds: string[];
  password?: string;
  image?: string;
  isActive: boolean;
}

export interface ProductResourceItem {
  id: string;
  handle: string;
  title: string;
  images: {
    src: string;
  }[];
  variants: {
    id: string;
  }[];
}

export interface CollectionResourceItem {
  id: string;
  handle: string;
  title: string;
  image?: {
    src: string;
  };
  productsCount: number;
}

export interface StoreThemeInput {
  id?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
}
