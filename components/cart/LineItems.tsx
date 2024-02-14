import { StoreCart } from "@/lib/cart";
import { FC, useState } from "react";
import DeleteIcon from "@/assets/icons/delete.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import MinusIcon from "@/assets/icons/minus.svg";
import { currencyFormatter } from "@/lib/helper/currency";
import Image from "next/image";
import { useCart } from "@/context/CartProvider";

const ItemCard: FC<{ item: StoreCart["lines"]["nodes"][0] }> = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { removeItem } = useCart();

  const price = Number(item.cost.amountPerQuantity.amount);
  const compareAtPrice = item.cost.compareAtAmountPerQuantity?.amount
    ? Number(item.cost.compareAtAmountPerQuantity.amount)
    : null;

  return (
    <li className="flex items-stretch" key={item.id}>
      <div className="relative mr-4 aspect-square h-20 w-20 bg-black/20">
        <Image
          src={
            item.merchandise.image.url ||
            item.merchandise.product.featuredImage.url
          }
          alt={
            item.merchandise.image.altText ||
            item.merchandise.product.featuredImage.altText
          }
          fill
        />
      </div>

      <div className="flex flex-1 flex-col items-stretch justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h2 className="flex-1 text-base">
              {item.merchandise.product.title}
            </h2>

            <button
              aria-label="Delete"
              onClick={() => removeItem({ lineId: item.id })}
            >
              <DeleteIcon className="u-icon-stroke--black" />
            </button>
          </div>

          <p>{item.merchandise.title}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p>
              {compareAtPrice && (
                <s>
                  {currencyFormatter({
                    amount: compareAtPrice,
                    currencyCode:
                      item.cost.compareAtAmountPerQuantity.currencyCode,
                  })}
                  &nbsp;
                </s>
              )}
              <b>
                {currencyFormatter({
                  amount: price,
                  currencyCode: item.cost.amountPerQuantity.currencyCode,
                })}
              </b>
            </p>
          </div>

          <div className="flex items-center bg-black text-white">
            <button className="px-2 py-2" aria-label="Decrease quantity">
              <MinusIcon className="u-icon-stroke--white w-4" />
            </button>

            <span className="flex-1 px-2  font-semibold">{quantity}</span>

            <button className="px-2 py-2" aria-label="Increase quantity">
              <PlusIcon className="u-icon-stroke--white w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

const LineItems: FC<{ items: StoreCart["lines"]["nodes"] }> = ({ items }) => {
  return (
    <section className="flex-1 overflow-y-auto px-6 py-8">
      <ul className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <ItemCard item={item} key={item.id} />
        ))}
      </ul>
    </section>
  );
};

export default LineItems;
