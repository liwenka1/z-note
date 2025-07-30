import { createFileRoute } from "@tanstack/react-router";
import { IndexPage } from "@renderer/pages/index-page";

export const Route = createFileRoute("/")({
  component: IndexPage
});
