import { useEffect, useRef, useState, useContext } from "react";
import { useSelector } from "react-redux";
import myColorPickerImage from "../img/myColorPickerImage.png";
import "./picker.css";
import { GameContext } from "../../store/GameContext";

function Picker({ setScore, score }) {
  const { room } = useContext(GameContext);

  let ctx;

  const originalColor = useSelector((state) => state.colors.chosenColor);
  const colorRef = useRef(null);
  const pickerRef = useRef(null);
  const markerRef = useRef(null);
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [distance, setDistance] = useState(180);

  const calcDst = (color) => {
    console.log(
      Math.min(
        Math.abs(color.h - originalColor.h),
        Math.abs(360 - color.h - originalColor.h)
      )
    );
    return Math.min(
      Math.abs(color.h - originalColor.h),
      Math.abs(360 - color.h - originalColor.h)
    );
  };

  const rgbTohsv = (r, g, b) => {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs);
    diff = v - Math.min(rabs, gabs, babs);
    diffc = (c) => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = (num) => Math.round(num * 100) / 100;
    if (diff === 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
        h = bb - gg;
      } else if (gabs === v) {
        h = 1 / 3 + rr - bb;
      } else if (babs === v) {
        h = 2 / 3 + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return {
      h: Math.round(h * 360),
      s: percentRoundFn(s * 100),
      v: percentRoundFn(v * 100),
    };
  };

  const handleClick = (e) => {
    ctx = pickerRef.current.getContext("2d");
    let bounding = pickerRef.current.getBoundingClientRect();
    let x = e.clientX - bounding.left;
    let y = e.clientY - bounding.top;
    markerRef.current.style.top = y + "px";
    markerRef.current.style.left = x + "px";
    let imgData = ctx.getImageData(x, y, 1, 1);
    let rgba = imgData.data;
    let hsv = rgbTohsv(rgba[0], rgba[1], rgba[2]);

    console.log(hsv);
    let sc = calcDst(hsv),
      scr;
    if (sc < 10) scr = 3;
    else if (sc >= 10 && sc < 20) scr = 2;
    else if (sc >= 20 && sc < 30) scr = 1;
    else if (sc >= 30) scr = 0;
    setDistance(sc);
    setScore(scr);
    room.send("set-player-score", scr);
  };
  useEffect(() => {
    ctx = pickerRef.current.getContext("2d");
    ctx.fillStyle = "black";
    let image = new Image();
    image.src = myColorPickerImage;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
  }, []);
  return (
    <>
      <div className="container">
        <div className="d-flex">
          {/* <div
            ref={colorRef}
            className="refColor"
            style={{
              background: `hsl(${originalColor.h}deg, ${originalColor.s}%, ${originalColor.v}%)`,
              width: "200px",
              height: "100px",
            }}
          ></div> */}
          <div className="colorDistance">
            {distance < 180 ? `${distance} hues far` : ""}
          </div>
        </div>
        <div className="canvasContainer">
          <canvas
            className="picker-canvas"
            width={sizes.width * 0.6}
            height={sizes.width * 0.3}
            ref={pickerRef}
            onClick={(e) => handleClick(e)}
            style={{ border: "1px solid black" }}
          ></canvas>
          <div ref={markerRef} className="marker"></div>
        </div>
      </div>
    </>
  );
}

export default Picker;
