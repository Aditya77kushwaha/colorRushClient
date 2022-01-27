/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GameContext } from "../store/GameContext";
import Clues from "./clues/Clues";
import Colors from "./colors/Colors.jsx";
import Picker from "./picker/Picker";
import GameOver from "../components/GameOver";
// import { reset } from "../store/features/colorSlice";
import "./picker/picker.css";
import { reset } from "../store/features/colorSlice";

const Game = ({
  host,
  setScore,
  score,
  players,
  rushers,
  setGameEndDetails,
  gameEndDetails,
  round,
  setRound,
}) => {
  const { room } = useContext(GameContext);
  // const isColorChosen = useSelector((state) => state.colors.isColorChosen);

  const [givenHints, setGivenHints] = useState(false);
  const [hints, setHints] = useState([]);
  const [guessed, setGuessed] = useState([]);
  // const [chosenColorByPlayer, setChosenColorByPlayer] = useState([]);
  const [hint, setHint] = useState("");
  const [hostChosenColor, setHostChosenColor] = useState();
  const [hasHostChosenColor, setHasHostChosenColor] = useState(false);
  const [startTime, setStartTime] = useState(false);
  const [time, setTime] = useState(room.state.timeLimit * 60);
  const [timeDisplay, setTimeDisplay] = useState({
    minutes: "00",
    seconds: "00",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    room.onMessage("set-hints", (msg) => {
      setHints(msg.hints);
      if (msg.submit) setStartTime(true);
    });
    room.onMessage("set-game-end", (details) => {
      // console.log("game over");
      // console.log(details);
      setGameEndDetails(details);
    });
    room.onMessage("set-player-score", (details) => {
      if (details.sessionId === room.sessionId) setScore(details.score);
    });
    room.onMessage("set-play-again", (details) => {
      setGivenHints(false);
      setHints([]);
      setGuessed([]);
      setRound((prevVal) => prevVal + 1);
      setStartTime(false);
      setHasHostChosenColor(false);
      setHostChosenColor(null);
      setTime(room.state.timeLimit * 60);
      // dispatch(reset());
    });
    room.onMessage("set-host-chosen-color", (msg) => {
      setHostChosenColor(msg);
    });
    room.onMessage("set-rusher-guessed", (msg) => {
      console.log("guesser", msg);
      setGuessed((prevVal) => [...prevVal, msg.guesser]);
    });
    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        // if (change.field === "hints") {
        //   setHints((prevVal) => [...prevVal, change.value]);
        // }
        if (change.field === "hasGivenHints") {
          setGivenHints(change.value);
          // setStartTime(true);
        }
        if (change.field === "timeLimit") {
          setTime(room.state.timeLimit * 60);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (startTime) {
      const intervalID = setInterval(() => {
        let min = `${Math.floor(time / 60)}`;
        if (min < 10) {
          min = "0" + min;
        }
        let sec = `${time % 60}`;
        if (sec < 10) {
          sec = "0" + sec;
        }
        setTimeDisplay({
          minutes: min,
          seconds: sec,
        });
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      if (time < 0) {
        //round end event
        clearInterval(intervalID);
        setStartTime(false);
      }
      return () => clearInterval(intervalID);
    }
  }, [time, startTime]);

  return (
    <>
      {!gameEndDetails ? (
        <div>
          <div className="countdown">
            {givenHints && (
              <h5 className="text-danger">
                Time Left {timeDisplay.minutes}:{timeDisplay.seconds}
              </h5>
            )}
          </div>
          {!hasHostChosenColor && room?.sessionId === host ? (
            <Colors setHasHostChosenColor={setHasHostChosenColor} />
          ) : time > -1 ? (
            <>
              {room?.sessionId === host &&
              rushers.length === guessed.length &&
              round === 2 ? (
                <button
                  disabled={rushers.length !== guessed.length}
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    room.send("game-end");
                  }}
                >
                  End
                </button>
              ) : (
                room?.sessionId === host &&
                rushers.length === guessed.length && (
                  <button
                    disabled={rushers.length !== guessed.length}
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      room.send("play-again");
                      dispatch(reset());
                    }}
                  >
                    Play Again
                  </button>
                )
              )}
              {room?.state.rushers.includes(
                room?.state.players[room?.sessionId].username
              ) &&
                !givenHints && <h1>Waiting for hints</h1>}
              {!room?.state.rushers.includes(
                room?.state.players[room?.sessionId].username
              ) && givenHints ? (
                <>
                  <h3>Awaiting Guesses</h3>
                  <p>
                    Rushers who have guessed :{" "}
                    {guessed
                      ? guessed.map((x) => {
                          return x + ", ";
                        })
                      : "No one"}
                  </p>
                  <p>
                    Rushers who still have to guess :{" "}
                    {Object.keys(players)?.map((id) => {
                      return (
                        !guessed.includes(players[id]?.username) &&
                        rushers.includes(players[id]?.username) &&
                        players[id]?.username !== players[host]?.username &&
                        players[id]?.username + ", "
                      );
                    })}
                  </p>
                </>
              ) : (
                room?.state.rushers.includes(
                  room?.state.players[room?.sessionId].username
                ) &&
                givenHints && <h3>Guess the color</h3>
              )}
              {givenHints && (
                <h3 className="pickerHints">
                  {hints.map((val, id) => {
                    return typeof val === "string" && val + ",";
                  })}
                </h3>
              )}
              {!room?.state.rushers.includes(
                room?.state.players[room?.sessionId].username
              ) &&
                !givenHints && (
                  <Clues
                    hint={hint}
                    hints={hints}
                    setHint={setHint}
                    setHints={setHints}
                    givenHints={givenHints}
                    setGivenHints={setGivenHints}
                    hostChosenColor={hostChosenColor}
                    host={host}
                  />
                )}
            </>
          ) : (
            room?.sessionId === host &&
            (round === 2 ? (
              <button
                disabled={rushers.length !== guessed.length}
                className="btn btn-sm btn-primary"
                onClick={() => {
                  room.send("game-end");
                }}
              >
                End
              </button>
            ) : (
              <button
                disabled={rushers.length !== guessed.length}
                className="btn btn-sm btn-primary"
                onClick={() => {
                  room.send("play-again");
                }}
              >
                Play Again
              </button>
            ))
          )}
          {room?.state.rushers.includes(
            room?.state.players[room?.sessionId].username
          ) && givenHints ? (
            <Picker
              setScore={setScore}
              score={score}
              setGuessed={setGuessed}
              players={players}
              hostChosenColor={hostChosenColor}
              timeDisplay={timeDisplay}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <GameOver
          gameEndDetails={gameEndDetails}
          players={players}
          rushers={rushers}
          guessed={guessed}
        />
      )}
    </>
  );
};

export default Game;
