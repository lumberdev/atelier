import { updateLineItem } from "@shopify/app-bridge/actions/Cart";
import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [lineItems, setLineItems] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const updateLineItems = (newCart) => {
    // update line items to be a string in the form: [{"variant_id":39072856,"quantity":5}]
    if (newCart.length === 0) {
      setLineItems("");
      return;
    }
    let lineItems = "[";
    newCart.forEach((item) => {
      lineItems += `{"variant_id":${item.id.replace(
        "gid://shopify/ProductVariant/",
        ""
      )},"quantity":${item.quantity}},`;
    });
    lineItems = lineItems.slice(0, -1);
    lineItems += "]";
    setLineItems(lineItems);
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    let totalCount = 0;
    let totalAmount = 0;
    newCart.forEach((item) => {
      totalCount += item.quantity;
      totalAmount += item.quantity * item.price;
    });
    setCartCount(totalCount);
    setCartTotal(totalAmount);
    localStorage.setItem("cart", JSON.stringify(newCart));
    updateLineItems(newCart);
  };

  const addItem = (formData) => {
    const { variant, formQuantity } = formData;
    console.log(variant);
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === variant.id);

    // Increase quantity of existing item
    if (existingItem) {
      existingItem.quantity += parseInt(formQuantity);
    }
    // Add a new item
    else {
      variant.quantity = parseInt(formQuantity);
      newCart.push(variant);
    }

    updateCart(newCart);
  };

  const decreaseItem = (item) => {
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === item.id);
    if (existingItem && existingItem.quantity > 1) existingItem.quantity -= 1;
    else if (existingItem && existingItem.quantity === 1)
      newCart.splice(newCart.indexOf(existingItem), 1);
    updateCart(newCart);
  };

  const increaseItem = (item) => {
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === item.id);
    if (existingItem) existingItem.quantity += 1;
    updateCart(newCart);
  };

  const clearItem = (item) => {
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === item.id);
    if (existingItem) newCart.splice(newCart.indexOf(existingItem), 1);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      updateCart(JSON.parse(cart));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        lineItems,
        cartItems,
        cartCount,
        cartTotal,
        updateCart,
        addItem,
        decreaseItem,
        increaseItem,
        clearItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
