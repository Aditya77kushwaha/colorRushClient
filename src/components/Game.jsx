/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { GameContext } from "../store/GameContext";
import Clues from "./clues/Clues";
import Colors from "./colors/Colors.jsx";
import Picker from "./picker/Picker";

const Game = ({ host, setScore, score }) => {
  const { room } = useContext(GameContext);
  const isColorChosen = useSelector((state) => state.colors.isColorChosen);

  const [givenHints, setGivenHints] = useState(false);
  const [hints, setHints] = useState([]);
  // const [guessed, setGuessed] = useState(false);
  // const [chosenColorByHost, setChosenColorByHost] = useState([]);
  // const [chosenColorByPlayer, setChosenColorByPlayer] = useState([]);
  const [hint, setHint] = useState("");

  useEffect(() => {
    room.onMessage("set-hints", (msg) => {
      setHints(msg.hints);
    });
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        if (change.field === "hints") {
          setHints((prevVal) => [...prevVal, change.value]);
          // if (hints.length > 0) setGivenHints(true);
        }
        if (change.field === "hasGivenHints") {
          setGivenHints(change.value);
        }
      });
    };
  }, []);

  return (
    <div>
      {!isColorChosen && room?.sessionId === host ? (
        <Colors />
      ) : (
        <>
          {/* <button
            onClick={() => {
              room.send("set-team-score", 10);
            }}
          >
            Set Score
          </button> */}
          {room?.sessionId !== host && !givenHints && (
            <h1>Waiting for host to give hints</h1>
          )}
          {room?.sessionId === host && givenHints ? (
            <h3>Awaiting Guesses</h3>
          ) : (
            room?.sessionId !== host && <h3>Guess the color</h3>
          )}
          {room?.sessionId !== host && givenHints && (
            <b>
              Hints by host :{" "}
              {hints.map((val, id) => {
                return typeof val === "string" && val + ",";
              })}
            </b>
          )}
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
      {room?.sessionId !== host && givenHints ? (
        <Picker setScore={setScore} score={score} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Game;
