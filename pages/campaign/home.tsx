import NavBar from "../../components/navbar";
import ProductGrid from "../../components/ProductGrid";

const HomeCampaignPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <NavBar />
      <ProductGrid products={null} />
    </div>
  );
};

export default HomeCampaignPage;
