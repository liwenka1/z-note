import { createRootRoute } from "@tanstack/react-router";
import { SimpleRootLayout } from "@renderer/components/simple-root-layout";

export const Route = createRootRoute({
  component: SimpleRootLayout
});
