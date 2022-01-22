import React, { useContext, useEffect } from "react";
import { GameContext } from "../store/GameContext";
import * as Colyseus from "colyseus.js";
import GameView from "./GameView";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const { client, setClient, room } = useContext(GameContext);
  const history = useHistory();

  useEffect(() => {
    function createClient() {
      const colyseusClient = new Colyseus.Client("ws://localhost:2567");
      setClient(colyseusClient);
      console.log("client created", colyseusClient, client);
    }
    createClient();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="home container">
      <div>
        {room.id ? (
          <GameView />
        ) : (
          <div className="gameForm">
            <div className="gameFormPlayerDetails form">
              <p>
                A team game where 1 group would be Rusher (color guesser) and
                the others would be Clue Givers. Rushers have to guess color
                based on clues given. Rushers and Clue Giver will play in
                collaboration.
              </p>
              <h6
                className="text-primary room-code"
                onClick={() => {
                  history.push("/info");
                  toast("Info page...");
                }}
              >
                For more information/help
              </h6>
            </div>
            <div className="gameFormJoinRoom d-flex justify-content-around mt-4">
              <div className="w-100 pe-5">
                <p>Create as Game Host</p>
                <button
                  onClick={() => {
                    history.push("/create-as-host");
                    toast("Create a room...");
                  }}
                  className="btn btn-sm btn-primary mt-3"
                >
                  Create Room
                </button>
              </div>
              <div className="w-100 border-start ps-5">
                <p>Join as a player</p>
                <button
                  onClick={() => {
                    history.push("/join");
                    toast("Join a room...");
                  }}
                  className="btn btn-sm btn-primary mt-3"
                >
                  Join Room
                </button>
              </div>
              <div className="w-100 border-start ps-5">
                <p>Join as a Game Facilitator</p>
                <button
                  onClick={() => {
                    history.push("/create-as-facilitator");
                    toast("Create as facilitator...");
                  }}
                  className="btn btn-sm btn-primary mt-3"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
