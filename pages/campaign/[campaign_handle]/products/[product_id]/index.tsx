import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import NavBar from "../../../../../components/Navbar";
import ProductPage from "../../../../../components/ProductPage";
import Spinner from "../../../../../components/Spinner";

const ProductCampaignPage = () => {
  const router = useRouter();
  const { campaign_handle, product_id } = router.query;
  const campaign = useCampaignOnStore({ campaign_handle }).campaign;

  return (
    <div className="flex flex-col items-center justify-center">
      <NavBar {...{ campaign }} />
      {!campaign.isLoading ? (
        <>
          <ProductPage {...{ campaign, product_id }} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          Loading product page
          <br />
          <br />
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ProductCampaignPage;
