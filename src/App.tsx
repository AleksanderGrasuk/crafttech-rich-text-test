import { useRef, useState } from "react";
import "./App.scss";
import Canvas from "./components/canvas/Canvas";
import Control from "./components/control/Control";
import { ToolType } from "./types/types";

function App() {
  const [tool, setTool] = useState<ToolType>("cursor");
  const stageRef = useRef(null);
  return (
    <>
      <Canvas tool={tool} stageRef={stageRef} />
      <Control tool={tool} setTool={setTool} />
    </>
  );
}

export default App;
