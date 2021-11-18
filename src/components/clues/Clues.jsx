import { useContext } from "react";
import { useSelector } from "react-redux";
import { GameContext } from "../../store/GameContext";
import "./clues.css";

const Clues = ({
  hint,
  hints,
  setHint,
  setHints,
  givenHints,
  setGivenHints,
}) => {
  const { room } = useContext(GameContext);
  const chosenColor = useSelector((state) => state.colors.chosenColor);
  const handleHintAdd = () => {
    setHints((prevVal) => [...prevVal, hints.length !== 0 ? "," + hint : hint]);
    setHint("");
  };
  const handleGiveHints = () => {
    room.send("give-hints", hints);
    setGivenHints(!givenHints);
  };
  return (
    <>
      <div className="cluesScreen container">
        <div className="hintsDisplay">
          <div>Hints : {hints}</div>{" "}
        </div>
        <div className="d-flex text-center justify-content-center">
          <div className="heading">
            <h3 className="type-h3">Give Clues for the Hue</h3>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div
            className="chosenColor"
            style={{
              background: `hsl(${chosenColor.h}deg, ${chosenColor.s}%, ${chosenColor.v}%)`,
            }}
          ></div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="hints">
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
            />
            <div className="row hintsBtn">
              <div className="col-12 col-sm-6">
                <button
                  className="addHintsBtn"
                  disabled={!hint}
                  onClick={handleHintAdd}
                >
                  Add
                </button>
              </div>
              <div className="col-12 col-sm-6 d-flex justify-content-end">
                <button className="submitHintsBtn" onClick={handleGiveHints}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Clues;
