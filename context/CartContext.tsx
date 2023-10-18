import React, { createContext, useContext, useEffect, useState } from "react";

type CartValue = {
  isCartOpen: boolean;
  openCart(): void;
  closeCart(): void;
  toggleCart(): void;
  cartItems: any[]; // Replace 'any[]' with the actual type cart items.
  cartCount: number;
  cartTotal: number;
  updateCart(newCart: any[]): void; // Replace 'any[]' with the actual type cart items.
  addItem(formData: { product: any; formQuantity: number }): void; // Replace 'any' with the actual type product.
  decreaseItem(item: any): void; // Replace 'any' with the actual type product.
  increaseItem(item: any): void; // Replace 'any' with the actual type product.
  clearItem(item: any): void; // Replace 'any' with the actual type product.
  clearCart(): void;
};

const defaultCartValue: CartValue = {
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  cartItems: [], // Replace 'any[]' with the actual type of your cart items.
  cartCount: 0,
  cartTotal: 0,
  updateCart: (newCart: any[]) => {}, // Replace 'any[]' with the actual type cart items.
  addItem: (formData: { product: any; formQuantity: number }) => {}, // Replace 'any' with the actual type product.
  decreaseItem: (item: any) => {}, // Replace 'any' with the actual type product.
  increaseItem: (item: any) => {}, // Replace 'any' with the actual type product.
  clearItem: (item: any) => {}, // Replace 'any' with the actual type product.
  clearCart: () => {},
};

const CartContext = createContext<CartValue>(defaultCartValue);
export const useCart = () => useContext(CartContext);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
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
        ...defaultCartValue,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prevState) => !prevState),
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
};
