import { useState } from "react";
import Image from "next/image";
import TrashIcon from "@/components/general/icons/TrashIcon";
import { useCart } from "@/context/CartContext";

const CartItem = ({ product, cartItemImageStyle, cartBackgroundColor }) => {
  const { decreaseItem, increaseItem, clearItem } = useCart();

  const quantityStyles = {
    backgroundColor: cartBackgroundColor,
  };

  return (
    <div className="flex py-6">
      <Image
        className={`mr-6  object-cover ${
          cartItemImageStyle === "round" ? "rounded-full" : "rounded-md"
        }`}
        src="https://cdn.shopify.com/s/files/1/0663/2836/3254/products/black-bag-over-the-shoulder_925x_d27a91ab-1f68-4a72-b2ba-f214d51b471d.jpg?v=1662735698"
        width={100}
        height={100}
        alt={product.title}
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex w-full justify-between">
            <div className="text-lg font-semibold">{product.title}</div>
            <button
              className="flex cursor-pointer appearance-none items-center justify-center border-none bg-transparent"
              onClick={() => clearItem(product)}
            >
              <TrashIcon />
            </button>
          </div>
          <div className="flex gap-1">
            {product.selectedOptions.map((selectedOption) => (
              <div key={selectedOption.name}>{selectedOption.name}</div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-md font-semibold">{product.price}</div>
          <div
            style={quantityStyles}
            className="flex h-7 items-center justify-between rounded-md border-[1px] border-solid border-black/20  drop-shadow-md"
          >
            <button
              className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent"
              onClick={() => decreaseItem(product)}
            >
              -
            </button>
            <input
              className="h-full w-[2.5rem] appearance-none border-none bg-transparent text-center"
              min={0} // Set the minimum value to 0
              type="number"
              value={product.quantity}
              onChange={(e) => setQuantity(Math.max(Number(e.target.value), 1))}
              style={{
                "-webkit-appearance": "none", // Webkit (Chrome, Safari) styles
                "-moz-appearance": "textfield", // Firefox styles
              }}
            />
            <button
              className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent"
              onClick={() => increaseItem(product)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
