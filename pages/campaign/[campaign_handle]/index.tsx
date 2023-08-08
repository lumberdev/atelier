import NavBar from "../../../components/Navbar";
import ProductGrid from "../../../components/ProductGrid";
import { useRouter } from "next/router";
import { useCampaigns } from "@/lib/hooks/useCampaigns";

const HomeCampaignPage = () => {
  const router = useRouter();
  const campaigns = useCampaigns().campaigns;
  const { campaign_handle } = router.query;
  const campaign = campaigns.filter(
    (campaign) => campaign.handle === campaign_handle
  )[0];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-1/2">{JSON.stringify(campaign)}</div>
      <NavBar {...{ campaign }} />
      <ProductGrid products={null} />
    </div>
  );
};

export default HomeCampaignPage;
