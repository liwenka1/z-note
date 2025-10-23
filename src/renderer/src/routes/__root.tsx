import { RootLayout } from "@renderer/layouts/root-layout";
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout
});
