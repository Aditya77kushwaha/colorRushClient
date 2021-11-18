import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { chooseColor } from "../../store/features/colorSlice";
import "./colors.css";

const Colors = () => {
  const chosenColor = useSelector((state) => state.colors.chosenColor);
  const colorOptions = useSelector((state) => state.colors.colorOptions);
  const dispatch = useDispatch();

  const handleClick = (color) => {
    dispatch(chooseColor(color));
  };
  return (
    <>
      <div className="chooseColorScreen container">
        <div className="d-flex text-center justify-content-center">
          <div className="heading">
            <h3 className="type-h3">Choose Color</h3>
          </div>
        </div>
        <div className="row">
          {colorOptions?.map((color, index) => (
            <div className="col-4 d-flex justify-content-center" key={index}>
              <div
                className="colorOption"
                style={{
                  backgroundColor: `hsl(${color.h}deg,${color.s}%,${color.v}%)`,
                  border: `${
                    chosenColor === color
                      ? `2vw solid hsl(${color.h}deg,${color.s + 10}%,${
                          color.v - 30
                        }%)`
                      : "none"
                  }`,
                  boxShadow: `${
                    chosenColor === color
                      ? "3px 6px 16px rgba(0,0,0,0.5)"
                      : "unset"
                  }`,
                }}
                onClick={() => handleClick(color)}
              ></div>
            </div>
          ))}
        </div>
        <div className="timeBarWrapper">
          <div className="timeBar">
            <div className="timeProgress"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Colors;
