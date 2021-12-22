import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../store/GameContext";
import * as Colyseus from "colyseus.js";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import "../components/game.css";

function Home() {
  const { client, setClient, setRoom } = useContext(GameContext);
  const history = useHistory();
  const [nameInput, setNameInput] = useState("player");
  const [maxPlayersInput, setMaxPlayersInput] = useState(1);
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);
  const gameData = JSON.parse(localStorage.getItem("gameData"));

  useEffect(() => {
    let isMounted = true;

    const colyseusClient = createClient();

    if (gameData) {
      colyseusClient
        .reconnect(gameData.roomId, gameData.sessionId)
        .then((room) => {
          console.log("joined successfully", room);
          if (isMounted) handleRoom(room);
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

    return () => (isMounted = false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function createClient() {
    const colyseusClient = new Colyseus.Client("ws://localhost:2567");
    setClient(colyseusClient);
    console.log("client created", colyseusClient, client);
    return colyseusClient;
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

  function handleCreate(e) {
    e.preventDefault();
    setIsCreateDisabled(true);
    client
      .create("regular", { username: nameInput, maxClients: maxPlayersInput })
      .then(handleRoom)
      .catch((e) => {
        console.log("JOIN ERROR from create", e);
        toast.error(`${e.message || "failed to create room"}`);
      })
      .finally(() => {
        setIsCreateDisabled(false);
      });
  }
  return (
    <div className="home mx-3">
      <div>
        <div className="gameForm">
          <div className="gameFormPlayerDetails">
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
            <div className="w-100 pe-5">
              <label className="form-label" htmlFor="max-players">
                Maximum players <small>(excluding host)</small>
              </label>
              <input
                id="max-players"
                type="text"
                value={maxPlayersInput}
                onChange={(e) => setMaxPlayersInput(e.target.value)}
                className="form-control "
                placeholder="enter max number of players"
              />
              <button
                onClick={handleCreate}
                className="btn btn-sm btn-primary mt-3"
                disabled={isCreateDisabled}
              >
                Create Room
                {isCreateDisabled && (
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
