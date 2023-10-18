import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

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
  };

  const addItem = (formData) => {
    const { product, formQuantity } = formData;
    console.log(product);
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === product.id);

    // Increase quantity of existing item
    if (existingItem) {
      existingItem.quantity += parseInt(formQuantity);
    }
    // Add a new item
    else {
      product.quantity = parseInt(formQuantity);
      newCart.push(product);
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

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
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
