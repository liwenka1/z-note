import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trash")({
  component: Trash
});

function Trash() {
  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold">垃圾箱</h1>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground">垃圾箱页面内容待开发...</p>
        </div>
      </div>
    </div>
  );
}
