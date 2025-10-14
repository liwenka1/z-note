/**
 * Tag详情页面
 * 在独立的tab中显示指定tag的mark列表
 */
import { MarkList } from "@renderer/components/tags/components/mark-list";

interface TagDetailPageProps {
  tagId: string;
}

export function TagDetailPage({ tagId }: TagDetailPageProps) {
  const tagIdNumber = parseInt(tagId, 10);

  return (
    <div className="h-full">
      <MarkList tagId={tagIdNumber} />
    </div>
  );
}
