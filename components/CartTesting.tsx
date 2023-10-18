import { useCart } from "@/context/CartContext";

const CartTesting = ({ campaign }) => {
  const {
    cartItems,
    decreaseItem,
    increaseItem,
    clearItem,
    clearCart,
    lineItems,
  } = useCart();

  return (
    <div className="relative border-solid p-4 bg-grey">
      <h3 className="absolute p-2 top-0 right-0">CART TESTING</h3>
      <h2 className="text-xl mb-4">Cart items:</h2>
      <table className="w-full">
        <tr>
          <th>Item</th>
          <th>ID</th>
          <th>Quantity</th>
          <th>Cart Controls</th>
        </tr>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <tr className="text-center">
              <td>{`${item.title}`}</td>
              <td>{`${item.id}`}</td>
              <td className="text-center">{`${item.quantity}`}</td>
              <td>
                <button
                  className="bg-[lightgreen] w-10 h-10 text-3xl uppercase text-black p-2 cursor-pointer inline-flex items-center justify-center"
                  onClick={() => increaseItem(item)}
                >
                  +
                </button>
                <button
                  className="bg-[pink] w-10 h-10 text-3xl uppercase text-black p-2 cursor-pointer inline-flex items-center justify-center"
                  onClick={() => decreaseItem(item)}
                >
                  -
                </button>
                <button
                  className="bg-[red] w-10 h-10 text-3xl uppercase text-white p-2 cursor-pointer inline-flex items-center justify-center"
                  onClick={() => clearItem(item)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="text-center pt-4" colSpan={3}>
              No items in cart
            </td>
          </tr>
        )}
      </table>
      <button
        className="bg-[darkred] w-full uppercase text-white py-2 px-4 rounded mt-4 cursor-pointer"
        onClick={clearCart}
      >
        Clear Cart
      </button>
    </div>
  );
};

export default CartTesting;
