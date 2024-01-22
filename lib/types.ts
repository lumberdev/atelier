export interface CampaignInput {
  id?: string;
  title: string;
  handle: string;
  description?: string;
  announcement?: string;
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

export interface ShopifyRecurringAppSubscription {
  id: string;
  name: string;
  test: boolean;
  status:
    | "ACTIVE"
    | "CANCELLED"
    | "DECLINED"
    | "EXPIRED"
    | "FROZEN"
    | "PENDING"
    | "ACCEPTED";
  currentPeriodEnd?: string | null;
  lineItems: {
    plan: {
      pricingDetails: {
        interval: "ANNUAL" | "EVERY_30_DAYS";
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    };
  }[];
}

export type CurrentSubscription = {
  name: string;
  status:
    | "ACTIVE"
    | "CANCELLED"
    | "DECLINED"
    | "EXPIRED"
    | "FROZEN"
    | "PENDING"
    | "ACCEPTED";
  currentPeriodEnd: string | null;
  price: string;
  currency: string;
};

export type PublicationCollectionListing = {
  id: string;
  isCampaign: boolean;
  isActive: boolean;
  handle: string;
  title: string;
  productCount: number;
  previewToken?: string;
}[];
