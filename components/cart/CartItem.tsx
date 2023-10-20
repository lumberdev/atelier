import { useEffect, useState } from "react";
import Image from "next/image";
import TrashIcon from "@/components/general/icons/TrashIcon";
import { useCart } from "@/context/CartContext";
import { currencyFormatter } from "@/lib/helper/currency";

const CartItem = ({ product, cartItemImageStyle, cartBackgroundColor }) => {
  const { decreaseItem, increaseItem, clearItem, updateItemQuantity } =
    useCart();
  const [quantity, setQuantity] = useState<number | "">(product.quantity);

  const quantityStyles = {
    backgroundColor: cartBackgroundColor,
  };

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);

  return (
    <div className="flex border-x-0 py-6">
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
          <div className="flex w-full justify-between gap-2">
            <div className="text-lg font-semibold">{product.title}</div>
            <button
              className="flex cursor-pointer appearance-none items-center justify-center border-none bg-transparent text-inherit"
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
          <div className="text-md flex items-center font-semibold text-inherit">
            {currencyFormatter({
              amount: product.price,
              currencyCode: "USD",
            })}
          </div>
          <div
            style={quantityStyles}
            className="flex h-7 items-center justify-between rounded-md border-[1px] border-solid border-black/20 drop-shadow-md"
          >
            <button
              className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent text-inherit"
              onClick={() => {
                decreaseItem(product);
                setQuantity(product.quantity);
              }}
            >
              -
            </button>
            <input
              className="h-full w-[2.5rem] appearance-none border-none bg-transparent text-center text-inherit"
              type="number"
              value={quantity}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                setQuantity(isNaN(newValue) ? "" : newValue); // Set to empty string if NaN
              }}
              onBlur={() => {
                updateItemQuantity(product, quantity);
              }}
              style={{
                "-webkit-appearance": "none", // Webkit (Chrome, Safari) styles
                "-moz-appearance": "textfield", // Firefox styles
              }}
            />
            <button
              className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent text-inherit"
              onClick={() => {
                increaseItem(product);
                setQuantity(product.quantity);
              }}
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
