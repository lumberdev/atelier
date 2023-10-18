import { useState } from "react";
import Image from "next/image";
import TrashIcon from "@/components/general/icons/TrashIcon";

const CartItem = ({ product, cartItemImageStyle, cartBackgroundColor }) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const quantityStyles = {
    backgroundColor: cartBackgroundColor,
  };

  return (
    <div className="flex py-6">
      <Image
        className={`mr-6  object-cover ${
          cartItemImageStyle === "round" ? "rounded-full" : "rounded-md"
        }`}
        src={product.imageUrl}
        width={100}
        height={100}
        alt={product.title}
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex w-full justify-between">
            <div className="text-lg font-semibold">{product.title}</div>
            <div className="flex items-center justify-center">
              <TrashIcon />
            </div>
          </div>
          <div className="flex gap-1">
            <div>Variant 1 |</div>
            <div>Variant 2</div>
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
              onClick={handleDecrease}
            >
              -
            </button>
            <input
              className="h-full w-[2.5rem] appearance-none border-none bg-transparent text-center"
              min={0} // Set the minimum value to 0
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(Number(e.target.value), 1))}
              style={{
                "-webkit-appearance": "none", // Webkit (Chrome, Safari) styles
                "-moz-appearance": "textfield", // Firefox styles
              }}
            />
            <button
              className="h-full w-5 cursor-pointer appearance-none border-none bg-transparent"
              onClick={handleIncrease}
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
