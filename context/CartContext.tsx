import React, { createContext, useContext, useEffect, useState } from "react";

type SelectedOption = {
  name: String;
  value: String;
}

type CartItem = {
  title: String;
  id: Number;
  price: Number;
  selectedOptions: SelectedOption[];
  image: {
    url: String;
    altText: String;
  },
  inventoryQuantity: Number;
  quantity: Number;
};

type CartValue = {
  isCartOpen: boolean;
  openCart(): void;
  closeCart(): void;
  toggleCart(): void;
  cartItems: CartItem[]; 
  cartCount: number;
  cartTotal: number;
  updateCart(newCart: CartItem[]): void; 
  addItem(formData: { item: CartItem; formQuantity: number }): void; 
  decreaseItem(item: CartItem): void; 
  increaseItem(item: CartItem): void; 
  updateItemQuantity(item: CartItem, qty: number | ""): void; 
  clearItem(item: CartItem): void; 
  clearCart(): void;
};

const defaultCartValue: CartValue = {
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  updateCart: (newCart: CartItem[]) => {}, 
  addItem: (formData: { item: CartItem; formQuantity: number }) => {}, 
  decreaseItem: (item: CartItem) => {}, 
  increaseItem: (item: CartItem) => {}, 
  updateItemQuantity: (item: CartItem, qty: number | "") => {}, 
  clearItem: (item: CartItem) => {}, 
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
    const { item, formQuantity } = formData;
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === item.id);
    // Increase quantity of existing item
    if (existingItem) {
      existingItem.quantity += parseInt(formQuantity);
    }
    // Add a new item
    else {
      item.quantity = parseInt(formQuantity);
      newCart.push(item);
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

  const updateItemQuantity = (item, qty: number | "") => {
    const newCart = [...cartItems];
    const existingItem = newCart.find((i) => i.id === item.id);
    if (existingItem) existingItem.quantity = qty ? qty : 1;
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
        updateItemQuantity,
        clearItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
