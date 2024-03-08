import { Drawer } from "vaul";
import CartIcon from "@/assets/icons/shopping-cart.svg";
import { useCart } from "@/context/CartProvider";
import CloseIcon from "@/assets/icons/x.svg";
import EmptyCart from "./EmptyState";
import LineItems from "./LineItems";
import CartSummary from "./Summary";
import { useTheme } from "@/context/ThemeProvider";
import { getTextColor } from "@/lib/helper/colors";

const MiniCart = () => {
  const { cart, isLoading, miniCartOpen, onMiniCartOpenChange } = useCart();
  const { global, cart: cartTheme } = useTheme();

  if (isLoading) return null;

  const Body = () =>
    cart?.totalQuantity ? (
      <LineItems items={cart.lines.nodes} />
    ) : (
      <EmptyCart />
    );

  const hasTotalAmount =
    cart &&
    !!cart.cost?.totalAmount?.amount &&
    cart.cost.totalAmount.amount !== "0.0";

  return (
    <Drawer.Root
      direction="right"
      open={miniCartOpen}
      onOpenChange={onMiniCartOpenChange}
    >
      <Drawer.Trigger aria-label="Open cart drawer" className="relative">
        <CartIcon />
        {cart?.totalQuantity > 0 && (
          <span
            className="bg-atelier-primary absolute -right-2 -top-3 flex aspect-square h-5 w-5 items-center justify-center rounded-full text-center text-[10px]"
            style={{ color: getTextColor(global.primaryColor) }}
          >
            {cart.totalQuantity}
          </span>
        )}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-10 bg-black/40" />

        <Drawer.Content
          className="fixed bottom-0 right-0 top-0 z-20 flex h-screen w-full flex-col items-stretch pt-8 md:max-w-sm"
          style={{
            backgroundColor: cartTheme.backgroundColor || global.secondaryColor,
            color: cartTheme.textColor || global.primaryColor,
          }}
        >
          <header className="flex items-center px-6">
            <Drawer.Close>
              <CloseIcon className="u-icon-stroke--black" />
            </Drawer.Close>

            <h1 className="ml-4 text-lg">{cartTheme.title}</h1>
          </header>

          <Body />

          {hasTotalAmount && (
            <CartSummary costs={cart.cost} checkoutUrl={cart.checkoutUrl} />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MiniCart;
