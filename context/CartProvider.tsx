import {
  createCart,
  getCartIdForCampaign,
  persistCartIdForCampaign,
  addToCart,
  StoreCart,
  getCart,
  removeLineItem,
  updateLineItem,
} from "@/lib/cart";
import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/router";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ICartContext {
  isLoading: boolean;
  cart: StoreCart | null;
  updateQuantity: (props: {
    lineId: string;
    quantity: number;
  }) => Promise<StoreCart | null>;
  removeItem: (props: { lineId: string }) => Promise<StoreCart | null>;
  addToCart: (props: {
    variantId: string;
    quantity?: number;
  }) => Promise<StoreCart | null>;
}

const CartContext = createContext<ICartContext>({
  isLoading: true,
  cart: null,
  updateQuantity: ({}) => Promise.resolve(null),
  removeItem: ({}) => Promise.resolve(null),
  addToCart: ({}) => Promise.resolve(null),
});
export const useCart = () => useContext(CartContext);

const CartProvider: FC<{
  shop?: string;
  storefrontAccessToken?: string;
  children: ReactNode;
}> = ({ shop, storefrontAccessToken, children }) => {
  const router = useRouter();
  const campaignHandle = router.query.campaign_handle as string;

  // If we're not at a campaign (sub)route we don't need to load a cart
  if (!router.pathname.includes("campaign_handle")) return children;
  if (!shop || !storefrontAccessToken) {
    console.error(
      "[CRITICAL] Unable to initialize CartProvider. Check the page props for missing dependencies."
    );
    return children;
  }

  const shopClient = useRef<AxiosInstance>();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [cart, setCart] = useState<ICartContext["cart"]>();

  useEffect(() => {
    // 1. Configure shopify client for the corresponding store
    shopClient.current = axios.create({
      baseURL: `https://${shop}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
    });

    // 2. Get cart for the corresponding campaign
    const persistedCartId = getCartIdForCampaign({
      store: shop,
      campaign: campaignHandle,
    });

    if (!persistedCartId) {
      setIsLoadingCart(false);
      return;
    }

    getCart({
      client: shopClient.current,
      id: persistedCartId,
    })
      .then((cart) => {
        setCart(cart);
      })
      .finally(() => setIsLoadingCart(false));
  }, []);

  const addOrCreateCart: ICartContext["addToCart"] = async ({
    variantId,
    quantity = 1,
  }) => {
    // If we don't have a local cart, create one with the selected variant/quantity
    if (!cart?.id) {
      const newCart = await createCart({
        client: shopClient.current,
        variantId,
        quantity,
      });

      persistCartIdForCampaign({
        cart: newCart,
        campaign: campaignHandle,
        store: shop,
      });

      setCart(newCart);

      return newCart;
    }

    // If we already have a local cart, add the selected variant/quantity
    const updatedCart = await addToCart({
      cartId: cart.id,
      client: shopClient.current,
      variantId,
      quantity,
    });

    setCart(updatedCart);

    return updatedCart;
  };

  const removeItem: ICartContext["removeItem"] = async ({ lineId }) => {
    const updatedCart = await removeLineItem({
      cartId: cart.id,
      client: shopClient.current,
      lineId,
    });

    setCart(updatedCart);

    return updatedCart;
  };

  const updateQuantity: ICartContext["updateQuantity"] = async ({
    lineId,
    quantity,
  }) => {
    const updatedCart = await updateLineItem({
      cartId: cart.id,
      client: shopClient.current,
      lineId,
      quantity,
    });

    setCart(updatedCart);

    return updatedCart;
  };

  return (
    <CartContext.Provider
      value={{
        isLoading: isLoadingCart,
        cart,
        addToCart: addOrCreateCart,
        removeItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
