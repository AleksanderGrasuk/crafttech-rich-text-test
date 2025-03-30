import HandIcon from "../../assets/images/hand.tsx";
import PlusIcon from "../../assets/images/plus.tsx";
import { ToolType } from "../../types/types";
import "./Control.scss";

const Control = ({
  tool,
  setTool,
}: {
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
}) => {
  // Обработчик изменения состояния инструмента
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "cursor" || value === "shape") {
      setTool(value as ToolType);
    } else {
      console.error(`Invalid tool type: ${value}`);
    }
  };

  return (
    <div className="control">
      <div className="control__item item-first">
        <input
          className="control__item-radio"
          type="radio"
          id="cursor"
          name="control"
          value="cursor"
          checked={tool === "cursor"}
          onChange={handleOnChange}
        />
        <label className="control__item-label" htmlFor="cursor">
          <HandIcon />
        </label>
      </div>

      <div className="control__item item-second">
        <input
          className="control__item-radio"
          type="radio"
          id="shape"
          name="control"
          value="shape"
          checked={tool === "shape"}
          onChange={handleOnChange}
        />
        <label className="control__item-label" htmlFor="shape">
          <PlusIcon />
        </label>
      </div>
    </div>
  );
};

export default Control;
