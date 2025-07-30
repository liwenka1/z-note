import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@renderer/pages/settings-page";

export const Route = createFileRoute("/settings")({
  component: SettingsPage
});
