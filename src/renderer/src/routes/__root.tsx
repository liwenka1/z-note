import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "@renderer/components/root-layout";

export const Route = createRootRoute({
  component: RootLayout
});
