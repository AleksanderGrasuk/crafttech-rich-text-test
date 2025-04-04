import { forwardRef, useRef, useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";
import "./HtmlText.scss";
import { IHtmlTextProps } from "../../types/types";

const HtmlText = forwardRef<HTMLDivElement, IHtmlTextProps>(
  ({ html, id, width, height, isEditing, onChange, onExitEditing }, ref) => {
    const quillRef = useRef<ReactQuill>(null);
    const [value, setValue] = useState(html);

    // Обработка выхода из режима редактирования
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onExitEditing();
        }
      },
      [onExitEditing]
    );

    // Обработка клика вне области редактирования
    useEffect(() => {
      if (isEditing) {
        document.addEventListener("keydown", handleKeyDown);
      } else {
        document.removeEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isEditing, handleKeyDown]);

    // Установка значения при изменении html
    useEffect(() => {
      setValue(html);
    }, [html]);

    return (
      <div
        id={`htmltext_${id}`}
        ref={ref}
        className={`htmltext-container ${isEditing ? "editing" : ""}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {isEditing ? (
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={(val) => {
              setValue(val);
              onChange(val);
            }}
            theme="bubble"
            modules={{
              toolbar: [
                [
                  { header: 1 },
                  { header: 2 },
                  "bold",
                  "italic",
                  "underline",
                  { color: [] },
                  "clean",
                ],
                [
                  { size: [] },
                  { align: [] },
                  { list: "ordered" },
                  { list: "bullet" },
                ],
              ],
            }}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              textAlign: "center",
            }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </div>
    );
  }
);

export default HtmlText;
