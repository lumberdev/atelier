export const currencyFormatter = ({ amount, currencyCode }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
