import React from "react";
import CartItem from "./CartItem";
import { CartItemType } from "@/lib/types";

const CartItems = ({ products, cartItemImageStyle, cartBackgroundColor }) => {
  return products.map((product: CartItemType) => (
    <CartItem
      key={product.id}
      product={product}
      cartItemImageStyle={cartItemImageStyle}
      cartBackgroundColor={cartBackgroundColor}
    />
  ));
};

export default CartItems;
