import { useTheme } from "@/context/ThemeProvider";
import { StoreCart } from "@/lib/cart";
import { getTextColor } from "@/lib/helper/colors";
import { currencyFormatter } from "@/lib/helper/currency";
import { FC } from "react";

const CartSummary: FC<{ costs: StoreCart["cost"]; checkoutUrl: string }> = ({
  costs,
  checkoutUrl,
}) => {
  const { global, cart } = useTheme();
  const subtotal = costs.subtotalAmount;
  const tax = costs.totalTaxAmount;
  const total = costs.totalAmount;

  return (
    <div className="bg-black/10 bg-opacity-20 px-6 py-4">
      <ul className=" mb-4 grid grid-cols-1 gap-2">
        <li className="flex items-center justify-between text-base">
          <span>Subtotal:</span>
          <span>
            {currencyFormatter({
              amount: Number(subtotal.amount),
              currencyCode: subtotal.currencyCode,
            })}
          </span>
        </li>

        {tax && (
          <li className="flex items-center justify-between text-base">
            <span>Tax:</span>
            <span>
              {currencyFormatter({
                amount: Number(tax.amount),
                currencyCode: tax.currencyCode,
              })}
            </span>
          </li>
        )}

        <li className="flex items-center justify-between text-lg">
          <span>Total:</span>
          <span>
            {currencyFormatter({
              amount: Number(total.amount),
              currencyCode: total.currencyCode,
            })}
          </span>
        </li>
      </ul>

      <a
        href={checkoutUrl}
        className="rounded-atelier bg-atelier-primary mx-auto block w-full px-4 py-2 text-center text-base font-semibold"
        style={{ color: getTextColor(global.primaryColor) }}
      >
        Checkout
      </a>
    </div>
  );
};

export default CartSummary;
