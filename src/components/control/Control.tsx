import { ToolType } from "../../types/types";
import "./Control.scss"

const Control = ({ tool, setTool }: { tool: ToolType; setTool: React.Dispatch<React.SetStateAction<ToolType>>}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTool(e.target.value as ToolType);
  };

  return (
    <div className="control">
      <div className="control__item">
        <input
          className="control__item-radio"
          type="radio"
          id="cursor"
          name="control"
          value="cursor"
          checked={tool === "cursor"}
          onChange={handleOnChange}
        />
        <label className="control__item-label" htmlFor="cursor">Взаимодействие</label>
      </div>

      <div className="control__item">
        <input
        className="control__item-radio"
          type="radio"
          id="shape"
          name="control"
          value="shape"
          checked={tool === "shape"}
          onChange={handleOnChange}
        />
        <label className="control__item-label" htmlFor="shape">Добавление</label>
      </div>
    </div>
  );
};

export default Control;
