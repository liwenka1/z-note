import { createFileRoute } from "@tanstack/react-router";
import { TagDetailPage } from "@renderer/pages/tag-detail-page";

export const Route = createFileRoute("/tags/$tagId")({
  component: TagDetail
});

function TagDetail() {
  const { tagId } = Route.useParams();

  return <TagDetailPage tagId={tagId} />;
}
