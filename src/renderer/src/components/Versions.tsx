import { useState } from "react";
import { Button } from "./ui/button";

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="versions">
      <Button variant="outline" className="electron-version">
        Electron v{versions.electron}
      </Button>
      <Button variant="outline" className="chrome-version">
        Chromium v{versions.chrome}
      </Button>
      <Button variant="outline" className="node-version">
        Node v{versions.node}
      </Button>
    </ul>
  );
}

export default Versions;
