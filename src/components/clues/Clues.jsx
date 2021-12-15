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
  // const [hintArray, setHintArray] = useState([]);
  const handleHintAdd = () => {
    console.log(hint);
    // let len = hint.split(" ");
    // len = len.filter((ele, pos, self) => {
    //   return ele !== "";
    // });
    if (
      hints.findIndex(
        (x) => x.trim().toUpperCase() === hint.trim().toUpperCase()
      ) === -1 &&
      hint.trim().toUpperCase().split(" ").length <= 3
    ) {
      setHints((prevVal) => [...prevVal, hint.trim().toUpperCase()]);
    }
    // hintArray += hints.length !== 0 ? "," + hint : hint;
    // setHintArray(
    //   hints.map((val, ind) => {
    //     return ind !== 0 ? val : "," + val;
    //   })
    // );
    setHint("");
  };
  const handleGiveHints = () => {
    setHints(hints.filter((v, i, a) => a.indexOf(v) === i));
    room.send("give-hints", hints);
    setGivenHints(!givenHints);
  };
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
                <button disabled={!hints.length} className="submitHintsBtn" onClick={handleGiveHints}>
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
