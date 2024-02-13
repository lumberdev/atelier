import { AxiosInstance } from "axios";

const CART_KEY = "carts";

const CART_FIELDS = `
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  totalQuantity
  lines(first: 100) {
    nodes {
      id
      quantity
      cost {
        amountPerQuantity {
          amount
          currencyCode
        }
        compareAtAmountPerQuantity {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          sku
        }
      }
    }
  }
`;

export interface StoreCart {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  totalQuantity: number;
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: {
        amountPerQuantity: {
          amount: string;
          currencyCode: string;
        };
        compareAtAmountPerQuantity: {
          amount: string;
          currencyCode: string;
        };
        subtotalAmount: {
          amount: string;
          currencyCode: string;
        };
        totalAmount: {
          amount: string;
          currencyCode: string;
        };
      };
      merchandise: {
        id: string;
        sku: string;
      };
    }[];
  };
}

const getCarts = () => {
  const carts: { [key: string]: string } = JSON.parse(
    window.localStorage.getItem(CART_KEY)
  );

  return carts;
};

export const getCartIdForCampaign = ({
  store,
  campaign,
}: {
  store: string;
  campaign: string;
}) => {
  const carts = getCarts();

  if (!carts) {
    window.localStorage.setItem(CART_KEY, JSON.stringify({}));
    return undefined;
  }

  return carts[`${store}:${campaign}`];
};

export const persistCartIdForCampaign = ({
  cart,
  campaign,
  store,
}: {
  cart: Awaited<ReturnType<typeof createCart>>;
  campaign: string;
  store: string;
}) => {
  const carts = getCarts();

  window.localStorage.setItem(
    CART_KEY,
    JSON.stringify({ ...carts, [`${store}:${campaign}`]: cart.id })
  );

  return true;
};

export const getCart = async ({
  client,
  id,
}: {
  client: AxiosInstance;
  id: string;
}) => {
  const { data } = await client.post<{
    data: {
      cart: StoreCart;
    };
  }>("", {
    query: `
      query StoreCart {
        cart(id: "${id}") {
          ${CART_FIELDS}
        }
      }
    `,
  });

  return data.data.cart;
};

export const createCart = async ({
  client,
  variantId,
  quantity = 1,
}: {
  client: AxiosInstance;
  variantId: string;
  quantity?: number;
}) => {
  const { data } = await client.post<{
    data: {
      cartCreate: {
        userErrors: { code: string; field: string; message: string }[];
        cart: StoreCart;
      };
    };
  }>("", {
    query: `
      mutation CartCreate {
        cartCreate(input: {
          lines: [
            {
              merchandiseId: "${variantId}",
              quantity: ${quantity}
            }
          ],
        }) {
          cart {
            ${CART_FIELDS}
          }

          userErrors {
            code
            field
            message
          }
        }
      }
    `,
  });

  return data.data.cartCreate.cart;
};

export const addToCart = async ({
  cartId,
  client,
  variantId,
  quantity = 1,
}: {
  cartId: string;
  client: AxiosInstance;
  variantId: string;
  quantity?: number;
}) => {
  const { data } = await client.post<{
    data: {
      cartLinesAdd: {
        userErrors: { code: string; field: string; message: string }[];
        cart: StoreCart;
      };
    };
  }>("", {
    query: `
      mutation AddToCart {
        cartLinesAdd(cartId: "${cartId}", lines: [
          {
            merchandiseId: "${variantId}",
            quantity: ${quantity}
          }
        ]) {
          userErrors {
            code
            field
            message
          }

          cart {
            ${CART_FIELDS}
          }
        }
      }
    `,
  });

  return data.data.cartLinesAdd.cart;
};
