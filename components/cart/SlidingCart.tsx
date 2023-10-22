// SlidingCart.js
import React from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import CloseIcon from "@/components/general/icons/CloseIcon";
import { CartItemType } from "@/lib/types";
import CartItems from "./CartItems";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import { currencyFormatter } from "@/lib/helper/currency";

const dummyCartItems: CartItemType[] = [
  {
    id: 7826283987190, //variant ID
    title: "Black Leather Bag", //product title
    qty: 1, // quantity
    price: "$30", // price
    description:
      "Womens black leather bag, with ample space. Can be worn over the shoulder, or remove straps to carry in your hand.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0663/2836/3254/products/black-bag-over-the-shoulder_925x_d27a91ab-1f68-4a72-b2ba-f214d51b471d.jpg?v=1662735698",
  },
  {
    id: 7825339154678,
    title: "Classic Leather Jacket",
    qty: 1,
    price: "$80",
    description: "Lorem Uipsum Lorem Uipsum Lorem Uipsum Lorem Uipsum",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0663/2836/3254/products/leather-jacket-and-tea_925x_3544a686-04bc-4c02-afe2-f5ba3e193c47.jpg?v=1662735694",
  },
];

const SlidingCart = () => {
  const { isCartOpen, closeCart, cartItems, cartCount, cartTotal } = useCart();
  const router = useRouter();
  const { handle } = router.query;

  const { isLoading: campaignLoading, campaign } = useCampaignOnStore({
    handle,
  });

  const cartStyles = {
    transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
    backgroundColor: campaign.cartBackgroundColor || "#fff",
    color: campaign.cartTextColor || "#000",
  };
  const cartDescriptionStyles = {
    backgroundColor: "rgba(178, 178, 178, 0.2)",
  };
  const checkoutContainerStyles = {
    boxShadow: "0px -4px 32px 0px rgba(0, 0, 0, 0.25)",
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={closeCart}
        ></div>
      )}
      {/* Cart */}
      <div
        style={cartStyles}
        className={
          "fixed right-0 top-0 flex h-full min-w-full flex-col justify-between pt-6 shadow-lg transition-transform md:min-w-[30rem] md:max-w-[38rem]"
        }
      >
        <div className="flex items-center justify-between px-6">
          <h2 className="text-2xl font-semibold ">{campaign.cartTitle}</h2>{" "}
          <div className="text-inherit">
            <CloseIcon className="cursor-pointer" onClick={closeCart} />
          </div>
        </div>
        {cartItems.length ? (
          <>
            <div className="mt-12 flex-grow overflow-y-auto px-6 ">
              <div className="divide-y divide-solid divide-black/10">
                <CartItems
                  products={cartItems}
                  cartItemImageStyle={campaign.cartItemsImageStyle}
                  cartBackgroundColor={campaign.cartBackgroundColor}
                />
              </div>
              {campaign.cartDescription && (
                <div
                  style={cartDescriptionStyles}
                  className="mt-10 rounded-md px-4 py-5"
                >
                  {campaign.cartDescription}
                </div>
              )}
            </div>
            <div style={checkoutContainerStyles} className="p-10">
              <div className="mb-4 flex items-center justify-between text-lg">
                <div className="font-bold">
                  Subtotal{" "}
                  <span className="font-semibold">{`(${cartCount} item${
                    cartCount > 1 ? "s" : ""
                  })`}</span>
                </div>
                <div className="font-bold">
                  {currencyFormatter({
                    amount: cartTotal,
                    currencyCode: "USD",
                  })}
                </div>
              </div>
              <div>
                <button
                  className={`h-[4rem] w-full cursor-pointer rounded-2xl border-none bg-black text-lg font-semibold text-white ${
                    campaign.cartItemsImageStyle === "round"
                      ? "rounded-full"
                      : "rounded-2xl"
                  }`}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-lg">Your cart is empty</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SlidingCart;
