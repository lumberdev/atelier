export interface CampaignInput {
  id?: string;
  isActive: boolean;
  announcement?: string;
  cartTitle?: string;
  cartItemsImageStyle?: string;
  cartDescription?: string;
  cartCheckoutButtonStyle?: string;
  cartBackgroundColor?: string;
  cartTextColor?: string;
  acpLayout?: string;
  acpPassword?: string;
  acpHeadline?: string;
  acpBody?: string;
  acpPasswordPlaceholder?: string;
  acpCTAText?: string;
  acpCTAUrl?: string;
  acpBackgroundColor?: string;
  acpBackgroundImage?: string;
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
  favicon?: string
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
  campaignId: string;
  isActive: boolean;
  handle: string;
  title: string;
  productCount: number;
  previewToken?: string;
}[];

export type CampaignProduct = {
  id: string;
  title: string;
  featuredImage: {
    altText: string;
    width: string;
    height: string;
    url: string;
  };
  description?: string;
  descriptionHtml?: string;
  priceRangeV2: {
    minVariantPrice: {
      amount: string;
    };
    maxVariantPrice: {
      amount: string;
    };
  };
  publishedOnPublication: boolean;
};

export type CampaignCollection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  image?: {
    id: string;
    width: number;
    height: number;
    altText?: string;
    url: string;
  };
  productsCount: number;
  products: {
    pageInfo?: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };

    edges: {
      node: CampaignProduct;
    }[];
  };
};

export type CampaignTheme = {
  id: string;
  created_at: string;
  name: string;
  previewable: boolean;
  processing: boolean;
  role: string;
  src: string;
  theme_store_id: string;
  updated_ap: string;
};

export type CampaignQueryFields = {
  id: string;
  collectionId: string;
  isActive: boolean;
  announcement: string;
  cartTitle: string;
  cartDescription: string;
  cartItemsImageStyle: string;
  cartBackgroundColor: string;
  cartTextColor: string;
  accessPageConfig: {
    layout: string;
    password: string;
    headline: string;
    body: string;
    passwordPlaceholder: string;
    ctaText: string;
    ctaUrl: string;
    backgroundColor: string;
    backgroundImage: string;
  };
};

export type CampaignFlatFields = {
  id: string;
  isActive: boolean;
  announcement: string;
  pageTitle: string;
  pageDescription: string;
  cartTitle: string;
  cartDescription: string;
  cartItemsImageStyle: string;
  cartBackgroundColor: string;
  cartTextColor: string;
  acpLayout: string;
  acpPassword: string;
  acpHeadline: string;
  acpBody: string;
  acpPasswordPlaceholder: string;
  acpCTAText: string;
  acpCTAUrl: string;
  acpBackgroundColor: string;
  acpBackgroundImage: string;
};
