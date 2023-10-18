// SlidingCart.js
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import CloseIcon from "@/components/general/icons/CloseIcon";
import { useProductsOnStore } from "@/lib/hooks/useProductsOnStore";
import { CartItemType } from "@/lib/types";
import CartItems from "./CartItems";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import router from "next/router";
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
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    cartCount,
    cartTotal,
  } = useCart();
  const router = useRouter();
  const { handle } = router.query;

  const { isLoading: campaignLoading, campaign } = useCampaignOnStore({
    handle,
  });

  const cartStyles = {
    transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
    backgroundColor: campaign.cartBackgroundColor,
  };

  return (
    <div
      style={cartStyles}
      className={`fixed right-0 top-0 flex h-full min-w-[35rem] max-w-full flex-col justify-between p-6 shadow-lg transition-transform `}
    >
      <div>
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-2xl font-semibold ">{campaign.cartTitle}</h2>{" "}
          <div className="text-black">
            <CloseIcon className="cursor-pointer" onClick={toggleCart} />
          </div>
        </div>
        <CartItems
          products={cartItems}
          cartItemImageStyle={campaign.cartItemsImageStyle}
          cartBackgroundColor={campaign.cartBackgroundColor}
        />
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between text-lg">
          <div className="font-bold">
            Subtotal{" "}
            <span className="font-semibold">{`(${cartCount} item${
              cartCount > 1 ? "s" : ""
            })`}</span>
          </div>
          <div className="font-bold">
            {currencyFormatter({ amount: cartTotal, currencyCode: "USD" })}
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
    </div>
  );
};

export default SlidingCart;
