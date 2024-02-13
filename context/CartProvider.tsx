import {
  createCart,
  getCartIdForCampaign,
  persistCartIdForCampaign,
  addToCart,
  StoreCart,
  getCart,
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
import { useQuery } from "react-query";

interface ICartContext {
  cart: StoreCart | null;
  addToCart: (props: {
    variantId: string;
    quantity?: number;
  }) => Promise<StoreCart | null>;
}

const CartContext = createContext<ICartContext>({
  cart: null,
  addToCart: ({}) => Promise.resolve(null),
});
export const useCart = () => useContext(CartContext);

const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { store } = useStore();

  const shopClient = useRef<AxiosInstance>();
  const [cart, setCart] = useState<ICartContext["cart"]>();

  const campaignHandle = router.query.campaign_handle as string;

  useEffect(() => {
    // If we're not at a campaign (sub)route we don't need to load a cart
    if (!router.pathname.includes("campaign_handle")) return;

    // If we don't have a store and access token skip client assignment
    if (!store.domain || !store.storefrontAccessToken) {
      shopClient.current = null;
      return;
    }

    // 1. Configure shopify client for the corresponding store
    shopClient.current = axios.create({
      baseURL: `https://${store.domain}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": store.storefrontAccessToken,
      },
    });

    // 2. Get cart for the corresponding campaign
    const persistedCartId = getCartIdForCampaign({
      store: store.domain,
      campaign: campaignHandle,
    });

    if (!persistedCartId) return;

    getCart({
      client: shopClient.current,
      id: persistedCartId,
    }).then((cart) => {
      console.log("[AT]", cart);
      setCart(cart);
    });
  }, [router.pathname, store]);

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
        store: store.domain,
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

  return (
    <CartContext.Provider value={{ cart, addToCart: addOrCreateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

const useStore = () => {
  const {
    data = {
      domain: "",
      storefrontAccessToken: "",
    },
    ...query
  } = useQuery<
    any,
    { error: { code: string; message: string } },
    { domain: string; storefrontAccessToken: string }
  >({
    queryKey: ["store"],
    queryFn: () =>
      axios
        .get("/api/store")
        .then((response) => response.data)
        .catch((error) => error?.response?.data?.error),
  });

  return {
    store: data,
    ...query,
  };
};
