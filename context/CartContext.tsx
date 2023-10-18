import React, { createContext, useContext, useState } from "react";

type CartValue = {
  isCartOpen: boolean;
  openCart(): void;
  closeCart(): void;
  toggleCart(): void;
};

const defaultCartValue: CartValue = {
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
};

const CartContext = createContext<CartValue>(defaultCartValue);
export const useCart = () => useContext(CartContext);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  return (
    <CartContext.Provider
      value={{
        ...defaultCartValue,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prevState) => !prevState),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
