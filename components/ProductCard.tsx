import { useProducts } from "@/lib/hooks/useProducts";

const ProductCard = ({ productURL }) => {
  const products = useProducts().products;
  console.log(products);

  return (
    <div className="border border-solid border-black p-4 overflow-hidden">
      <img
        className="w-48 h-48 object-cover max-w-full"
        src={
          "https://res.cloudinary.com/teepublic/image/private/s--7XnF-2yf--/t_Resized Artwork/c_crop,x_10,y_10/c_fit,h_513/c_crop,g_north_west,h_626,w_470,x_-42,y_-22/g_north_west,u_upload:v1462829024:production:blanks:a59x1cgomgu5lprfjlmi,x_-437,y_-347/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1547541049/production/designs/3986023_0.jpg"
        }
      />
      <h3>{productURL}</h3>
      <div className="flex flex-row">
        <h3 className="line-through	mr-1">$99.99</h3>
        <h3>$49.99</h3>
      </div>
    </div>
  );
};

export default ProductCard;
