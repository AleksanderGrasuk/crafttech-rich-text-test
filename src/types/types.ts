import { RefObject } from "react";
import Konva from "konva";
export type ToolType = "cursor" | "shape";
export interface IFigure {
  id: string;
  width: number;
  height: number;
  type: string;
  x: number;
  y: number;
  html: string;
  text: string;
  tool?: ToolType;
  stageRef?: RefObject<Konva.Stage>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragMove?: () => void;
}
export interface ICanvasProps {
  tool: ToolType;
  stageRef: RefObject<Konva.Stage>;
}

export interface IHtmlTextProps {
  html: string;
  id: string;
  className?: string;
}

export interface IShapeTextAreaProps {
  x: number;
  y: number;
}
