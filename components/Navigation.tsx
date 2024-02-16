import { useAppBridge } from "@shopify/app-bridge-react";
import { AppLink, ChannelMenu } from "@shopify/app-bridge/actions";

const Navigation = () => {
  const app = useAppBridge();

  const home = AppLink.create(app, {
    label: "Overview",
    destination: "/app",
  });

  const settings = AppLink.create(app, {
    label: "Settings",
    destination: "/app/settings",
  });

  const tagmanager = AppLink.create(app, {
    label: "Tag Manager",
    destination: "/app/tag-manager",
  });

  ChannelMenu.create(app, {
    items: [home, settings, tagmanager],
    active: home,
  });

  return null;
};

export default Navigation;
