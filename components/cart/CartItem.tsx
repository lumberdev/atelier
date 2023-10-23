import { useEffect, useState } from "react";
import Image from "next/image";
import TrashIcon from "@/components/general/icons/TrashIcon";
import { useCart } from "@/context/CartContext";
import { currencyFormatter } from "@/lib/helper/currency";
// import svg of placeholder image from assets/placeholder-image.svg
import PlaceholderImage from "@/assets/placeholder-image.svg";

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
                if (newValue >= 1 && newValue <= product.inventoryQuantity) setQuantity(isNaN(newValue) ? "" : newValue); // Set to empty string if NaN
              }}
              onBlur={() => {
                updateItemQuantity(product, quantity);
              }}
                style={{
                  WebkitAppearance: "none", // Webkit (Chrome, Safari) styles
                  MozAppearance: "textfield", // Firefox styles
                }}
              />
              <button
                className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent text-inherit disabled:opacity-50"
                disabled={product.quantity >= product.inventoryQuantity}
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
