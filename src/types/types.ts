import { RefObject } from "react";
import 
     Konva from "konva";
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
}