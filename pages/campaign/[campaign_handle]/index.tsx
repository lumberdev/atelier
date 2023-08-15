import NavBar from "../../../components/Navbar";
import ProductGrid from "../../../components/ProductGrid";
import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import Spinner from "@/components/Spinner";

const HomeCampaignPage = () => {
  const router = useRouter();
  const { campaign_handle } = router.query;
  const campaign = useCampaignOnStore({ campaign_handle }).campaign;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <div className="w-1/2">{JSON.stringify(campaign)}</div> */}
      {campaign ? (
        <>
          <NavBar {...{ campaign }} />
          <ProductGrid {...{ campaign }} />
        </>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center">
          Loading campaign
          <br />
          <br />
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default HomeCampaignPage;
