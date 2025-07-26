import { Button } from "./components/ui/button";

const App: React.FC = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");
  const versions = window.electron.process.versions;

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
    </>
  );
};

export default App;
