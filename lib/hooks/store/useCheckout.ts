import { useQuery } from "react-query";

const getLineItemString = (cartItems) => {
  // get cart to be string in the form: [{"variant_id":39072856,"quantity":5}]
  if (cartItems.length === 0) return "";
  let lineItems = "[";
  cartItems.forEach((item) => {
    lineItems += `{"variant_id":${item.id.replace(
      "gid://shopify/ProductVariant/",
      ""
    )},"quantity":${item.quantity}},`;
  });
  lineItems = lineItems.slice(0, -1);
  lineItems += "]";
  return lineItems;
};

export const useCheckout = ({ store_id, cart_items }) => {
  const line_items = getLineItemString(cart_items);
  const { data = { checkout: {} }, isLoading } = useQuery<{
    checkout: any;
  }>(
    ["checkout", store_id, line_items],
    async () => {
      const params = new URLSearchParams({ store_id, line_items });
      const response = await fetch(`/api/checkout?${params.toString()}`);
      return await response.json();
    },
    {
      enabled: !!store_id && !!line_items,
    }
  );
  return {
    isLoading,
    checkout: data.checkout,
  };
};