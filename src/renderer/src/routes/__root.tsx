import { RootLayout } from "@renderer/components/root-layout";
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout
});
