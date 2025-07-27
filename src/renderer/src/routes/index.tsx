import { Button } from "@renderer/components/ui/button";
import { useCounterStore } from "@renderer/store/counterStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index
});

function Index() {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");
  const versions = window.electron.process.versions;

  const { count, increment, decrement, reset, updateMaxHistory, history, settings, setStep, clearHistory, step } =
    useCounterStore();

  return (
    <>
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <Button className="action" onClick={ipcHandle}>
          Send IPC
        </Button>
      </div>
      <Button variant="outline" className="electron-version">
        Electron v{versions.electron}
      </Button>
      <Button variant="outline" className="chrome-version">
        Chromium v{versions.chrome}
      </Button>
      <Button variant="outline" className="node-version">
        Node v{versions.node}
      </Button>
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">{count}</div>
        <div className="text-2xl font-bold">{step}</div>
        <div className="text-2xl font-bold">{JSON.stringify(settings)}</div>
        <div className="text-2xl font-bold">{JSON.stringify(history)}</div>
        <div className="flex gap-2">
          <Button onClick={increment}>+1</Button>
          <Button onClick={decrement}>-1</Button>
          <Button onClick={reset}>Reset</Button>
          <Button onClick={() => updateMaxHistory(10)}>Update Max History</Button>
          <Button onClick={() => setStep(2)}>Set Step to 2</Button>
          <Button onClick={() => clearHistory()}>Clear History</Button>
        </div>
      </div>
    </>
  );
}
