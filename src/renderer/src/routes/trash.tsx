import { createFileRoute } from "@tanstack/react-router";
import { TrashPage } from "@renderer/pages/trash-page";

export const Route = createFileRoute("/trash")({
  component: TrashPage
});
