import { useState } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import Shape from "../shape/Shape";
import { IFigure, ICanvasProps } from "../../types/types";

const Canvas = ({ tool, stageRef }: ICanvasProps) => {
  const [figures, setFigures] = useState<IFigure[]>([]);

  const handleOnClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "cursor") return;
    const stage = e.target.getStage();
    if (!stage) return;
    const stageOffset = stage.absolutePosition();
    const point = stage.getPointerPosition();
    if (!point) return;
    setFigures((prev: IFigure[]) => [
      ...prev,
      {
        id: Date.now().toString(36),
        width: 100,
        height: 100,
        type: "rect",
        x: point.x - stageOffset.x,
        y: point.y - stageOffset.y,
        html: "",
        text: "",
      },
    ]);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={tool === "cursor"}
      onClick={handleOnClick}
      ref={stageRef}
    >
      <Layer>
        {figures.map((figure: IFigure, i: number) => (
          <Shape key={i} {...figure} stageRef={stageRef} tool={tool} />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
