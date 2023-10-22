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

export const useCheckoutOnStore = ({ store_id, cart_items }) => {
  const line_items = getLineItemString(cart_items);
  const { data = { checkout: {} }, isLoading } = useQuery<{
    checkout: any;
  }>(
    ["checkout", store_id, line_items],
    () =>
      fetch(`/api/checkout?store_id=${store_id}&line_items=${line_items}`).then(
        (response) => response.json()
      ),
    {
      enabled: !!store_id && !!line_items,
    }
  );
  return {
    isLoading,
    checkout: data.checkout,
  };
};
