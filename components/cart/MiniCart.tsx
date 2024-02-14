import { Drawer } from "vaul";
import CartIcon from "@/assets/icons/shopping-cart.svg";
import { useCart } from "@/context/CartProvider";
import CloseIcon from "@/assets/icons/x.svg";
import EmptyCart from "./EmptyState";
import LineItems from "./LineItems";
import CartSummary from "./Summary";

const MiniCart = () => {
  const { cart, isLoading } = useCart();

  if (isLoading) return null;

  const Body = () =>
    cart?.totalQuantity ? (
      <LineItems items={cart.lines.nodes} />
    ) : (
      <EmptyCart />
    );

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger aria-label="Open cart drawer" className="relative">
        <CartIcon />
        {cart?.totalQuantity && (
          <span className="absolute -right-2 -top-3 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-black text-center text-[10px] text-white">
            {cart.totalQuantity}
          </span>
        )}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-10 bg-black/40" />

        <Drawer.Content className="fixed bottom-0 right-0 top-0 z-20 flex h-screen w-full flex-col items-stretch bg-white pt-8 md:max-w-sm">
          <header className="flex items-center px-6">
            <Drawer.Close>
              <CloseIcon class="u-icon-stroke--black" />
            </Drawer.Close>

            <h1 className="ml-4 text-lg">Your cart</h1>
          </header>

          <Body />

          {cart && (
            <CartSummary costs={cart.cost} checkoutUrl={cart.checkoutUrl} />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MiniCart;
