import { useEffect, useState } from "react";
import Image from "next/image";
import TrashIcon from "@/components/general/icons/TrashIcon";
import { useCart } from "@/context/CartContext";
import { currencyFormatter } from "@/lib/helper/currency";
// import svg of placeholder image from assets/placeholder-image.svg
import PlaceholderImage from "@/assets/placeholder-image.svg";
import { set } from "react-hook-form";
import { errorToJSON } from "next/dist/server/render";

const CartItem = ({ product, cartItemImageStyle, cartBackgroundColor }) => {
  const { decreaseItem, increaseItem, clearItem, updateItemQuantity } =
    useCart();
  const [quantity, setQuantity] = useState<number | "">(product.quantity);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quantityStyles = {
    backgroundColor: cartBackgroundColor,
  };

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);

  const addNewErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage((currentErrorMessage) => {
        if (currentErrorMessage === message) {
          return null;
        }
        return currentErrorMessage;
      });
    }, 3000);
  }; 

  return (
    <div className="flex border-x-0 py-6">
      <Image
        className={`mr-6  object-cover ${
          cartItemImageStyle === "round" ? "rounded-full" : "rounded-md"
        }`}
        src={product.image ? product.image.url : PlaceholderImage}
        width={100}
        height={100}
        alt={product.title}
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex w-full justify-between gap-2">
            <div className="text-lg font-semibold">{product.product_title}</div>
            <button
              className="flex cursor-pointer appearance-none items-center justify-center border-none bg-transparent text-inherit"
              onClick={() => clearItem(product)}
            >
              <TrashIcon />
            </button>
          </div>
          {product.selectedOptions[0]?.value != "Default Title" &&
          <div className="flex gap-1">
            {product.selectedOptions.map((selectedOption) => (
              selectedOption.value
            )).join(" / ")}
          </div>}
        </div>
        <div className="flex justify-between">
          <div className="text-md flex items-center font-semibold text-inherit">
            {currencyFormatter({
              amount: product.price,
              currencyCode: "USD",
            })}
          </div>
          <div className="max-w-[9rem] text-center text-xs leading-[14px] text-red-500">
            {errorMessage}
          </div>
          <div
            style={quantityStyles}
            className="flex h-7 items-center justify-between rounded-md border-[1px] border-solid border-black/20 drop-shadow-md"
          >
            <button
              className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent text-inherit"
              onClick={() => {
                setErrorMessage(null);
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
                if (newValue <= product.inventoryQuantity) {
                  if (newValue >= 1 && !isNaN(newValue)) {
                    setErrorMessage(null);
                    setQuantity(newValue);
                  }
                  else {
                    setErrorMessage(null);
                    setQuantity(1);
                  }
                } else {
                  addNewErrorMessage("Quantity cannot be greater than inventory quantity");
                }
              }}
              onBlur={() => {
                setErrorMessage(null);
                updateItemQuantity(product, quantity);                
              }}
                style={{
                  WebkitAppearance: "none", // Webkit (Chrome, Safari) styles
                  MozAppearance: "textfield", // Firefox styles
                }}
              />
              <button
                className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent text-inherit disabled:opacity-50"
                onClick={() => {
                  if (product.quantity < product.inventoryQuantity) {
                    setErrorMessage(null);
                    increaseItem(product);
                    setQuantity(product.quantity);
                  }
                  else {
                    addNewErrorMessage("Quantity cannot be greater than inventory quantity");
                  }
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
