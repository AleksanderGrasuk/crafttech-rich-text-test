import html2canvas from "html2canvas";
import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import HtmlText from "../htmlText/HtmlText";
import {IFigure, IShapeTextAreaProps} from "../../types/types";
import "./Shape.scss";
const Shape = (props: IFigure) => {
  const { x, y, width, height, tool, html, id, text } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [textareaPos, setTextareaPos] = useState<IShapeTextAreaProps>({ x: 0, y: 0 });

  const groupRef = useRef<Konva.Group >(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const htmlRef = useRef<HTMLDivElement >(null);
  const textRef = useRef<Konva.Text>(null);
  const renderImage = useCallback(async () => {
    const htmltext = document.getElementById(`htmltext_${id}`);
    if (htmltext) {
      const innerhtml = htmltext.innerHTML;
      htmltext.innerHTML = value
      if (innerhtml) {
        const canvas = await html2canvas(htmltext, {
          backgroundColor: "rgba(0, 0, 0, 0)",
        });
        const shape = new Konva.Image({
          x: 0,
          y: height ,
          scaleX: 1 / window.devicePixelRatio,
          scaleY: 1 / window.devicePixelRatio,
          image: canvas,
        });
        groupRef.current?.add(shape);
        if (imageRef.current) {
          imageRef.current = shape;
        }
      } else return;
    } else return;
  }, [height, id, value]);

  useEffect(() => {
    renderImage();
  }, [renderImage]);

  const handleClick = () => {
    if (tool === "shape") {
      return;
    } else {
      setIsEditing((prev) => !prev);
      if (imageRef.current) {
        if (isEditing) {
          imageRef.current.show();
        } else {
          imageRef.current.hide();
        }
      } else return;
      const textNode = textRef.current;
      if (textNode) {
        const stage = textNode.getStage();
        const absPos = textNode.getAbsolutePosition();
        const containerRect = stage ? stage.container().getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
        setTextareaPos({
          x: containerRect.left + absPos.x,
          y: containerRect.top + absPos.y,
        });
      }

    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Group x={x} y={y} onClick={handleClick} ref={groupRef} draggable>
        <Rect stroke={"black"} width={width} height={height} />
        {isEditing && (
          <Html>
            <textarea className="htmltext" data-x={textareaPos.x} data-y={textareaPos.y} value={value} onChange={handleInput} />
          </Html>
        )}
      </Group>
      <Html>
        <HtmlText ref={htmlRef} html={html} id={id} />
      </Html>
    </>
  );
};

export default Shape;
