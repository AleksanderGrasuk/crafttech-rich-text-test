// import html2canvas from "html2canvas";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.bubble.css";
// import Konva from "konva";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { Group, Rect } from "react-konva";
// import { Html } from "react-konva-utils";
// import HtmlText from "../htmlText/HtmlText";
// import { IFigure, IShapeTextAreaProps } from "../../types/types";
// import "./Shape.scss";

// const Shape = (props: IFigure) => {
//   const { x, y, width, height, tool, html, id, text } = props;
//   const [isEditing, setIsEditing] = useState(false);
//   const [value, setValue] = useState(text);
//   const [textareaPos, setTextareaPos] = useState<IShapeTextAreaProps>({
//     x: 0,
//     y: 0,
//   });

//   const groupRef = useRef<Konva.Group>(null);
//   const imageRef = useRef<Konva.Image | null>(null);
//   const htmlRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<Konva.Text>(null);
//   const htmlContainerRef = useRef<HTMLDivElement>(null);
//   const quillRef = useRef<ReactQuill>(null);
//   const renderImage = useCallback(async () => {
//     const htmltext = document.getElementById(`htmltext_${id}`);
//     if (htmltext) {
//       htmltext.innerHTML = value;
//       console.log(htmltext);
//       const innerhtml = htmltext.innerHTML;
//       if (innerhtml) {
//         const canvas = await html2canvas(htmltext, {
//           backgroundColor: "rgba(0, 0, 0, 0)",
//           useCORS: true, // Для загрузки шрифтов и стилей с внешних источников
//         });
//         const shape = new Konva.Image({
//           x: 0,
//           y: 0,
//           width: canvas.width,
//           height: canvas.height,
//           scaleX: 1 / window.devicePixelRatio,
//           scaleY: 1 / window.devicePixelRatio,
//           image: canvas,
//         });
//         if (imageRef.current) {
//           imageRef.current.destroy();
//         }
//         groupRef.current?.add(shape);
//         groupRef.current?.draw();

//         imageRef.current = shape;
//       } else return;
//     } else return;
//   }, [id, value]);

//   const handleExitEditing = useCallback(() => {
//     if (isEditing) {
//       setIsEditing(false);
//       renderImage();
//     }
//   }, [isEditing, renderImage]);

//   const handleClick = () => {
//     if (tool === "shape") {
//       return;
//     } else {
//       setIsEditing((prev) => {
//         const newEditingState = !prev;
//         if (!newEditingState && imageRef.current) {
//           renderImage();
//         }
//         return newEditingState;
//       });
//       if (imageRef.current) {
//         if (isEditing) {
//           imageRef.current.show();
//         } else {
//           imageRef.current.hide();
//         }
//       } else return;
//       const textNode = textRef.current;
//       if (textNode) {
//         const stage = textNode.getStage();
//         const absPos = textNode.getAbsolutePosition();
//         const containerRect = stage
//           ? stage.container().getBoundingClientRect()
//           : { left: 0, top: 0 };
//         setTextareaPos({
//           x: containerRect.left + absPos.x,
//           y: containerRect.top + absPos.y,
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     if (!isEditing) return;

//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         htmlContainerRef.current &&
//         quillRef.current &&
//         !htmlContainerRef.current.contains(event.target as Node) &&
//         !quillRef.current?.editor?.container?.parentElement?.contains(
//           event.target as Node
//         )
//       ) {
//         handleExitEditing();
//       }
//     };

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         handleExitEditing();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isEditing, handleExitEditing, htmlContainerRef, quillRef]);

//   return (
//     <>
//       <Group
//         x={x}
//         y={y}
//         onClick={handleClick}
//         ref={groupRef}
//         draggable
//         clip={{ x: 0, y: 0, width: width, height: height }}
//       >
//         <Rect stroke={"black"} width={width} height={height} />
//         {isEditing && (
//           <Html>
//             <div
//               id={`htmltext_${id}`}
//               ref={htmlContainerRef}
//               className="htmltext"
//               style={{
//                 top: `${textareaPos.y}px`,
//                 left: `${textareaPos.x}px`,
//                 width: `${width}px`,
//                 height: `${height}px`,
//               }}
//             >
//               <ReactQuill
//                 ref={quillRef}
//                 value={value}
//                 onChange={setValue}
//                 theme="bubble"
//                 modules={{
//                   toolbar: [
//                     [
//                       { header: 1 },
//                       { header: 2 },
//                       "bold",
//                       "italic",
//                       "underline",
//                     ],
//                     [{ list: "ordered" }, { list: "bullet" }, "clean"],
//                     [
//                       { size: ["small", false, "large", "huge"] },
//                       { color: ["red", "green", "blue"] },
//                       { align: ["left", "center", "right"] },
//                     ],
//                   ],
//                 }}
//                 style={{ height: `${height}px` }}
//               />
//             </div>
//           </Html>
//         )}
//       </Group>
//       <Html>
//         <HtmlText ref={htmlRef} html={html} id={id} />
//       </Html>
//     </>
//   );
// };

// export default Shape;

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

  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  const renderImage = useCallback(async () => {
    const htmltext = document.getElementById(`htmltext_${id}`);
    if (htmltext) {
      const toolbar = htmltext.querySelector(".ql-tooltip");
      if (toolbar) {
        toolbar.setAttribute("style", "display: none;");
      }
      const computedStyles = window.getComputedStyle(htmltext);
      for (const key of computedStyles) {
        htmltext.style.setProperty(key, computedStyles.getPropertyValue(key));
      }
      const canvas = await html2canvas(htmltext, {
        backgroundColor: "rgba(0, 0, 0, 0)",
        useCORS: true,
      });

      if (toolbar) {
        toolbar.setAttribute("style", "display: block;");
      }
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
    }
  }, [id, value]);

  const handleExitEditing = useCallback(() => {
    renderImage();
    setIsEditing(false);
  }, [renderImage, isEditing]);

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
  }, [isEditing, handleExitEditing, id, htmlContainerRef]);

  return (
    <Group
      x={x}
      y={y}
      onClick={handleClick}
      ref={groupRef}
      draggable
      clip={{ x: 0, y: 0, width: width, height: height }}
    >
      <Rect stroke={"black"} width={width} height={height} />
      {isEditing ? (
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
      ) : null}
    </Group>
  );
};

export default Shape;
