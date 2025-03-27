import { forwardRef } from "react";
import { IHtmlTextProps } from "../../types/types";

const HtmlText = forwardRef<HTMLDivElement, IHtmlTextProps>(
  ({ html, id }, ref) => {
    return (
      <div
        id={`htmltext_${id}`}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          position: "fixed",
          overflow: "hidden",
          left: "100000px",
          top: "100000px",
        }}
        ref={ref}
      ></div>
    );
  }
);

export default HtmlText;
