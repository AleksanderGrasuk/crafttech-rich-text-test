import html2canvas from "html2canvas";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import HtmlText from "../htmlText/HtmlText";
import { IFigure, IShapeTextAreaProps } from "../../types/types";
import "./Shape.scss";

const Shape = (props: IFigure) => {
  const { x, y, width, height, tool, html, id, text } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [textareaPos, setTextareaPos] = useState<IShapeTextAreaProps>({
    x: 0,
    y: 0,
  });

  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<Konva.Text>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill>(null);
  const renderImage = useCallback(async () => {
    const htmltext = document.getElementById(`htmltext_${id}`);
    if (htmltext) {
      htmltext.innerHTML = value;
      console.log(htmltext);
      const innerhtml = htmltext.innerHTML;
      if (innerhtml) {
        const canvas = await html2canvas(htmltext, {
          backgroundColor: "rgba(0, 0, 0, 0)",
        });
        const shape = new Konva.Image({
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
          scaleX: 1 / window.devicePixelRatio,
          scaleY: 1 / window.devicePixelRatio,
          image: canvas,
        });
        if (imageRef.current) {
          imageRef.current.destroy();
        }
        groupRef.current?.add(shape);
        groupRef.current?.draw();

        imageRef.current = shape;
      } else return;
    } else return;
  }, [id, value]);

  const handleExitEditing = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      renderImage();
    }
  }, [isEditing, renderImage]);

  const handleClick = () => {
    if (tool === "shape") {
      return;
    } else {
      setIsEditing((prev) => {
        const newEditingState = !prev;
        if (!newEditingState && imageRef.current) {
          renderImage();
        }
        return newEditingState;
      });
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
        const containerRect = stage
          ? stage.container().getBoundingClientRect()
          : { left: 0, top: 0 };
        setTextareaPos({
          x: containerRect.left + absPos.x,
          y: containerRect.top + absPos.y,
        });
      }
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        htmlContainerRef.current &&
        quillRef.current &&
        !htmlContainerRef.current.contains(event.target as Node) &&
        !quillRef.current?.editor?.container?.parentElement?.contains(
          event.target as Node
        )
      ) {
        handleExitEditing();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleExitEditing();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, handleExitEditing, htmlContainerRef, quillRef]);

  return (
    <>
      <Group
        x={x}
        y={y}
        onClick={handleClick}
        ref={groupRef}
        draggable
        clip={{ x: 0, y: 0, width: width, height: height }}
      >
        <Rect stroke={"black"} width={width} height={height} />
        {isEditing && (
          <Html>
            <div
              id={`htmltext_${id}`}
              ref={htmlContainerRef}
              className="htmltext"
              style={{
                top: `${textareaPos.y}px`,
                left: `${textareaPos.x}px`,
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <ReactQuill
                ref={quillRef}
                value={value}
                onChange={setValue}
                theme="bubble"
                modules={{
                  toolbar: [
                    [
                      { header: 1 },
                      { header: 2 },
                      "bold",
                      "italic",
                      "underline",
                    ],
                    [{ list: "ordered" }, { list: "bullet" }, "clean"],
                  ],
                }}
                style={{ height: `${height}px` }}
              />
            </div>
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
