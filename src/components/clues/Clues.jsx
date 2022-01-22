/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
// import { useSelector } from "react-redux";
import { GameContext } from "../../store/GameContext";
import "./clues.css";

const Clues = ({
  hint,
  hints,
  setHint,
  setHints,
  givenHints,
  setGivenHints,
  hostChosenColor,
  host,
}) => {
  const { room } = useContext(GameContext);
  // const chosenColor = useSelector((state) => state.colors.chosenColor);
  const handleHintAdd = () => {
    console.log(hint);
    if (
      hints.findIndex(
        (x) => x.trim().toUpperCase() === hint.trim().toUpperCase()
      ) === -1 &&
      hint.trim().toUpperCase().split(" ").length <= 3
    ) {
      // setHints((prevVal) => [...prevVal, hint.trim().toUpperCase()]);
      room.send("new-hint", hint.trim().toUpperCase());
    }
    setHint("");
  };
  const handleGiveHints = () => {
    // setHints(hints.filter((v, i, a) => a.indexOf(v) === i));
    room.send("give-hints", hints);
    setGivenHints(!givenHints);
  };

  useEffect(() => {
    // room.onMessage("set-hints", (msg) => {
    //   setHints(msg.hints);
    // });
    // room.state.onChange = (changes) => {
    //   changes.forEach((change) => {
    //     if (change.field === "hints") {
    //       setHints((prevVal) => [...prevVal, change.value]);
    //     }
    //   });
    // };
  }, []);
  return (
    <>
      <div className="cluesScreen container">
        <div className="hintsDisplay">
          <div className="d-flex">
            Hints :{" "}
            {hints.map((val, id) => {
              return (
                <li style={{ listStyle: "none" }} key={id}>
                  {val + ","}
                </li>
              );
            })}
          </div>
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
              background: `hsl(${hostChosenColor?.color[0]}deg, ${hostChosenColor?.color[1]}%, ${hostChosenColor?.color[2]}%)`,
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
                {room?.sessionId === host && (
                  <button
                    disabled={!hints.length}
                    className="submitHintsBtn"
                    onClick={handleGiveHints}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Clues;
