import html2canvas from "html2canvas";
import Konva from "konva";
import { useCallback, useRef, useState, useEffect } from "react";
import { Group, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import HtmlText from "../htmlText/HtmlText";
import { IFigure } from "../../types/types";
import "./Shape.scss";

const Shape = (props: IFigure) => {
  const { x, y, width, height, tool, html, id } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(html);
  const [position, setPosition] = useState({ x, y });

  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  //   Отрисовка изображения при изменении состояния
  const renderImage = useCallback(async () => {
    const htmltext = document.getElementById(`htmltext_${id}`);
    if (!htmltext) return;

    const toolbar = htmltext.querySelector(".ql-tooltip");
    if (toolbar) toolbar.setAttribute("style", "display: none;");

    const computedStyles = window.getComputedStyle(htmltext);
    for (const key of computedStyles) {
      htmltext.style.setProperty(key, computedStyles.getPropertyValue(key));
    }

    //Конвертируем HTML в изображение
    const canvas = await html2canvas(htmltext, {
      backgroundColor: "rgba(0, 0, 0, 0)",
      useCORS: true,
    });

    if (toolbar) toolbar.setAttribute("style", "display: block;");

    const shape = new Konva.Image({
      x: 0,
      y: 0,
      width: width,
      height: height,
      image: canvas,
    });

    if (imageRef.current) {
      imageRef.current.destroy();
    }
    groupRef.current?.add(shape);
    groupRef.current?.draw();
    imageRef.current = shape;
  }, [id, width, height]);

  // Отрисовка изображения при монтировании компонента
  const handleExitEditing = useCallback(() => {
    renderImage();
    setIsEditing(false);
  }, [renderImage]);

  const handleClick = () => {
    if (tool !== "shape") {
      setIsEditing((prev) => !prev);

      if (imageRef.current) {
        if (!isEditing) {
          imageRef.current.hide();
        } else {
          imageRef.current.show();
        }
        groupRef.current?.draw();
      }
    }
  };

  // Перемещение элемента
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();
    setPosition({ x, y });
  };

  // Завершение перетаскивания элемента
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();
    setPosition({ x, y });
  };

  // Выход из режима редактирования
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        htmlContainerRef.current &&
        !htmlContainerRef.current.contains(event.target as Node)
      ) {
        handleExitEditing();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, htmlContainerRef, handleExitEditing]);

  return (
    <Group
      x={position.x}
      y={position.y}
      onClick={handleClick}
      ref={groupRef}
      draggable={tool === "cursor"}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      clip={{ x: 0, y: 0, width: width, height: height }}
    >
      <Rect stroke={"black"} width={width} height={height} fill="white" />

      {isEditing && (
        <Html>
          <HtmlText
            ref={htmlContainerRef}
            html={value}
            id={id}
            width={width}
            height={height}
            isEditing={isEditing}
            onChange={setValue}
            onExitEditing={handleExitEditing}
          />
        </Html>
      )}
    </Group>
  );
};

export default Shape;
