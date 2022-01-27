import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../store/GameContext";
import * as Colyseus from "colyseus.js";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import "../components/game.css";

function Home() {
  const { roomCode } = useParams();
  const { client, setClient, setRoom } = useContext(GameContext);
  const history = useHistory();
  const [roomCodeInput, setRoomCodeInput] = useState(roomCode);
  const [nameInput, setNameInput] = useState("");
  const [isJoinDisabled, setIsJoinDisabled] = useState(false);
  const gameData = JSON.parse(localStorage.getItem("gameData"));

  useEffect(() => {
    let isMounted = true;

    const colyseusClient = createClient();

    if (gameData && colyseusClient) {
      colyseusClient
        .reconnect(gameData.roomId, gameData.sessionId)
        .then((room) => {
          console.log("joined successfully", room);
          if (isMounted) handleRoom(room);
        })
        .catch((e) => {
          console.error("join error", e);
          if (e?.message?.includes("session expired")) {
            toast.error("session expired / game opened somewhere else");
          } // clear if not able to join
          else {
            toast.error(e.message || "failed to join previous game");
            localStorage.clear();
          }
        });
    }

    return () => (isMounted = false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function createClient() {
    const colyseusClient = new Colyseus.Client(
      "wss://color-rush-backend.herokuapp.com/"
    );
    setClient(colyseusClient);
    console.log("client created", colyseusClient, client);

    const gameData = JSON.parse(localStorage.getItem("gameData"));
    if (gameData) {
      colyseusClient
        .reconnect(gameData.roomId, gameData.sessionId)
        .then((room) => {
          console.log("joined successfully", room);
          handleRoom(room);
        })
        .catch((e) => {
          console.error("join error", e);
          if (e?.message?.includes("session expired")) {
            toast.error('looks like you"ve opened the game somewhere else');
            toast("close that to join here ");
          } // clear if not able to join
          else {
            toast.error(e.message || "failed to join previous game");
            localStorage.clear();
          }
        });
    }
  }
  function handleRoom(room) {
    setRoom(room);
    history.push(`/game`);
    const gameData = {
      sessionId: room.sessionId,
      roomId: room.id,
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
    console.log(room.id, "room joined");
  }

  function handleJoin(e) {
    e.preventDefault();
    setIsJoinDisabled(true);
    client
      .joinById(roomCodeInput, {
        username: nameInput,
      })
      .then(handleRoom)
      .catch((e) => {
        console.log("JOIN ERROR", e);
        toast.error(`${e.message || "failed to join room"}`);
      })
      .finally(() => {
        setIsJoinDisabled(false);
      });
  }

  return (
    <div className="home mx-3">
      <div>
        <div className="gameForm">
          <div className="gameFormPlayerDetails form">
            <label htmlFor="name" className="form-label">
              Enter your name{" "}
            </label>
            <input
              id="name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="player name"
              className="form-control"
            />
          </div>
          <div className="gameFormJoinRoom d-flex justify-content-around mt-4">
            <div className="w-100">
              <label className="form-label" htmlFor="room-code">
                Room Code
              </label>
              <input
                id="room-code"
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                className="form-control "
                placeholder="enter code to join"
              />
              <button
                disabled={isJoinDisabled}
                onClick={handleJoin}
                className="mt-4 cr-btn"
              >
                Join Room
                {isJoinDisabled && (
                  <>
                    <span
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Loading...</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
