export interface CampaignInput {
  id?: string;
  title: string;
  handle: string;
  description?: string;
  collectionIds: string[];
  productIds: string[];
  variantIds: string[];
  image?: string;
  isActive: boolean;
  cartTitle?: string;
  cartItemsImageStyle?: string;
  cartDescription?: string;
  cartCheckoutButtonStyle?: string;
  cartBackgroundColor?: string;
  cartTextColor?: string;
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
  logoPosition?: string;
}

export interface CartItemType {
  id: number;
  title: string;
  qty: number;
  price: string;
  description: string;
  imageUrl: string;
}
export interface AccessPageConfigInput {
  id?: string;
  campaignId: string;
  layout: string;
  headline: string;
  body?: string;
  password?: string;
  passwordPlaceholder?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}
