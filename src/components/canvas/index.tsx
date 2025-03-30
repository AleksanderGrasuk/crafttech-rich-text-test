import { useState } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import Shape from "../shape/Shape";
import { IFigure, ICanvasProps } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import "./Canvas.scss";

const Canvas = ({ tool, stageRef }: ICanvasProps) => {
  const [figures, setFigures] = useState<IFigure[]>([]);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  // Добавление нового элемента
  const handleOnClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "cursor") return;

    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    const stageOffset = stage.container().getBoundingClientRect();

    // Создание нового элемента
    setFigures((prev: IFigure[]) => [
      ...prev,
      {
        id: uuidv4(),
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

  // Перемещение холста
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const position = stage.position();
    setStagePosition({ x: position.x, y: position.y });
  };

  // Завершение перетаскивания холста
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const position = stage.position();
    setStagePosition({ x: position.x, y: position.y });
  };

  return (
    <Stage
      className="canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={tool === "cursor"}
      onClick={handleOnClick}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      ref={stageRef}
      x={stagePosition.x}
      y={stagePosition.y}
    >
      <Layer>
        {figures.map((figure: IFigure) => (
          <Shape key={figure.id} {...figure} stageRef={stageRef} tool={tool} />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
