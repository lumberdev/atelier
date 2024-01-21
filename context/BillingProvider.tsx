import useFetch from "@/components/hooks/useFetch";
import {
  CurrentSubscription,
  ShopifyRecurringAppSubscription,
} from "@/lib/types";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Modal } from "@shopify/polaris";
import { AppSubscription } from "@shopify/shopify-api";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";

interface IBillingContext {
  subscription?: CurrentSubscription;
  subscribe: ({ plan }: { plan: "STARTER" | "PREMIUM" }) => void;
  cancel: () => void;
}

const BillingContext = createContext<IBillingContext>({
  subscribe: () => {},
  cancel: () => {},
});
export const useBilling = () => useContext(BillingContext);

const BillingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const app = useAppBridge();
  const fetch = useFetch();
  const router = useRouter();
  const redirect = Redirect.create(app);

  const [subscription, setSubscription] =
    useState<CurrentSubscription>(undefined);
  const [showCancelActionModal, setShowCancelActionModal] =
    useState<boolean>(false);

  const { isLoading } = useQuery<
    null,
    any,
    { subscriptions: ShopifyRecurringAppSubscription[] }
  >({
    queryKey: "billing",
    queryFn: () =>
      fetch("/api/apps/billing").then((response) => response.json()),
    onSuccess: ({ subscriptions }) => {
      if (!subscriptions.length) {
        router.replace("/app/onboarding");
        return;
      }

      const plan = subscriptions?.find((s) => s.status === "ACTIVE");
      if (!plan) return;

      const sub: CurrentSubscription = {
        name: plan.name,
        status: "ACTIVE",
        currentPeriodEnd: plan.currentPeriodEnd
          ? format(new Date(plan.currentPeriodEnd), "MMM dd")
          : "",
        price: plan.lineItems[0].plan.pricingDetails.price.amount,
        currency: "USD",
      };
      setSubscription(sub);
    },
  });

  const { mutate: subscribe } = useMutation<
    { confirmationUrl: string },
    any,
    { plan: "STARTER" | "PREMIUM" }
  >({
    mutationFn: (variables) =>
      fetch("/api/apps/billing", {
        method: "POST",
        body: JSON.stringify(variables),
      }).then((response) => response.json()),
    onSuccess: (response) => {
      if (!response?.confirmationUrl) {
        console.error();
        return;
      }

      redirect.dispatch(Redirect.Action.REMOTE, response.confirmationUrl);
    },
  });

  const { mutate: cancelSubscription } = useMutation<
    { subscription: CurrentSubscription },
    any
  >({
    mutationFn: () =>
      fetch("/api/apps/billing/cancel", { method: "POST" }).then((response) =>
        response.json()
      ),
    onSuccess: (response) => {
      if (
        !response.subscription ||
        response.subscription.status !== "CANCELLED"
      )
        return;

      setShowCancelActionModal(false);
    },
  });

  return (
    <BillingContext.Provider
      value={{
        subscription,
        subscribe,
        cancel: () => setShowCancelActionModal(true),
      }}
    >
      {children}

      <Modal
        open={showCancelActionModal}
        onClose={() => setShowCancelActionModal(false)}
        title="Are you sure you want to cancel your subscription?"
        primaryAction={{
          destructive: true,
          content: "Cancel my subscription",
          onAction: () => cancelSubscription(),
        }}
        secondaryActions={[
          {
            content: "Go back",
            onAction: () => setShowCancelActionModal(false),
          },
        ]}
      >
        <Modal.Section>
          You'll lose access to your campaigns, if you subscribe back you'll
          still have access to them.
        </Modal.Section>
      </Modal>
    </BillingContext.Provider>
  );
};

export default BillingProvider;
