import { PlaygroundHeader } from "./header";
import { PlatformList } from "./platform-list";
import { WebviewView } from "./webview";
import { usePlaygroundState } from "./hooks/use-playground-state";

/**
 * AI Playground 主组件
 * 职责：视图路由和组件组合
 */
export function AIPlaygroundPanel() {
  const { currentView, selectedPlatform, selectPlatform, backToList } = usePlaygroundState();

  return (
    <div className="bg-background flex h-full flex-col">
      {/* 根据视图状态渲染不同内容 */}
      {currentView === "list" ? (
        <>
          <PlaygroundHeader variant="list" />
          <PlatformList onSelect={selectPlatform} />
        </>
      ) : (
        <>
          <PlaygroundHeader variant="webview" platform={selectedPlatform!} onBack={backToList} />
          <WebviewView platform={selectedPlatform!} />
        </>
      )}
    </div>
  );
}
