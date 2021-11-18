import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { GameContext } from "../store/GameContext";
import Clues from "./clues/Clues";
import Colors from "./colors/Colors.jsx";
import Picker from "./picker/Picker";

const Game = ({ host }) => {
  const { room } = useContext(GameContext);
  const isColorChosen = useSelector((state) => state.colors.isColorChosen);

  const [givenHints, setGivenHints] = useState(false);
  // const [guessed, setGuessed] = useState(false);
  const [hints, setHints] = useState([]);
  const [hint, setHint] = useState("");

  useEffect(() => {
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        if (change.field === "hints") {
          setHints((prevVal) => [...prevVal, change.value]);
          // if (hints.length > 0) setGivenHints(true);
        }
        if (change.field === "hasGivenHints") {
          setGivenHints(true);
        }
      });
    };
  }, []);

  return (
    <div>
      <h1>Game</h1>

      {!isColorChosen && room?.sessionId === host ? (
        <Colors />
      ) : (
        <>
          {room?.sessionId !== host && !givenHints && (
            <h1>Waiting for host to give hints</h1>
          )}
          {givenHints && <p>Hints by host : {hints}</p>}
          {/* {hints} */}
          {room?.sessionId === host && !givenHints && (
            <Clues
              hint={hint}
              hints={hints}
              setHint={setHint}
              setHints={setHints}
              givenHints={givenHints}
              setGivenHints={setGivenHints}
            />
          )}
        </>
      )}
      {givenHints ? <Picker /> : ""}
    </div>
  );
};

export default Game;
