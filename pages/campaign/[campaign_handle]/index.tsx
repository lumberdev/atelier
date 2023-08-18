import NavBar from "../../../components/Navbar";
import ProductGrid from "../../../components/ProductGrid";
import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import { useProductsOnStore } from "@/lib/hooks/useProductsOnStore";
import LoadingScreen from "@/components/LoadingScreen";

const HomeCampaignPage = () => {
  const router = useRouter();
  const { campaign_handle } = router.query;
  const campaign = useCampaignOnStore({ campaign_handle }).campaign;
  const productIDs = campaign?.resourceIds;
  const { products: allProducts, isLoading: productsLoading } =
    useProductsOnStore({
      store_id: campaign.storeId,
    });
  const products = allProducts.filter((product) =>
    productIDs.includes(product.id)
  );

  if (productsLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col items-center justify-center">
      <NavBar {...{ campaign, campaign_handle }} />
      <ProductGrid {...{ products, campaign_handle }} />
    </div>
  );
};

export default HomeCampaignPage;
