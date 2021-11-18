import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { FiMinus, FiPlus } from "react-icons/fi";
import { GameContext } from "../store/GameContext";
import Game from "../components/Game";
import { useHistory } from "react-router-dom";
import Team from "../components/Team";

// Game settings will be done here
const GameView = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const { room, setRoom, client } = useContext(GameContext);
  const [players, setPlayers] = useState({});
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [host, setHost] = useState(null);
  const [roundLimit, setRoundLimit] = useState(2);
  const [timeLimit, setTimeLimit] = useState(3);
  const [teamLimit, setTeamLimit] = useState(2);
  const [rusherPerTeamLimit, setRusherPerTeamLimit] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasTeamsFormed, setHasTeamsFormed] = useState(false);
  const [teamsData, setTeamsData] = useState({});
  const [teamsName, setTeamsName] = useState("");

  function copyRoomCode() {
    const input = document.createElement("input");
    input.value = room.id;
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    console.log("copied");
    toast("code copied");
  }

  function handleGameStart() {
    console.log("Starting Game...");
    room.send("start", { value: true });
  }
  function handleLeave() {
    history.push("/join");
    room.leave(true);
    toast("good bye ... 👋");
    localStorage.clear();
    setRoom({ id: "" });
  }

  useEffect(() => {
    room.onMessage("form-teams", (msg) => {
      console.log("Formed teams...");
      console.log(msg);
      setTeamsData(msg);
    });
    room.state.messages.onAdd = (msg, length) => {
      // console.log(x, y);
      console.log(msg);
      setMessages((prevVal) => [...prevVal, msg]);
    };
    room.state.players.onAdd = (player, sessionId) => {
      if (sessionId === room.sessionId) {
        // name of user
        setUsername(player.username);
      }
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [sessionId]: {
          username: player.username,
        },
      }));
      toast(`${player.username} joined`);

      player.onChange = (changes) => {
        changes.forEach((change) => {
          setPlayers((prevPlayers) => {
            const newPlayersState = { ...prevPlayers };
            newPlayersState[sessionId][change.field] = change.value;
            if (change.field === "team" && sessionId === room.sessionId) {
              console.log("Change team event...");
              console.log(client.id, sessionId);
              setTeamsName(change.value);
            }
            return newPlayersState;
          });
        });
      };
      // player.triggerAll()
    };

    room.state.players.onRemove = (player, sessionId) => {
      console.log("player left", player, sessionId);
      toast(`${player?.username} left`);
      setPlayers((prevPlayers) => {
        const newPlayers = { ...prevPlayers };
        delete newPlayers[sessionId];
        return newPlayers;
      });
    };

    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        if (change.field === "isGameStarted") {
          setIsGameStarted(change.value);
        }
        if (change.field === "hasTeamsFormed") {
          setHasTeamsFormed(change.value);
        }
        if (change.field === "host") {
          setHost(change.value);
          console.log("Host is", change.value);
        }
      });
    };

    room.onError((code, message) => {
      console.log("oops, error ocurred : code ", code);
      console.log(message);
      toast.error(message || "500 internal server error");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleRoundInc = () => {
    room.send("round-limit", Number(roundLimit) + 1);
    setRoundLimit((prevVal) => prevVal + 1);
  };
  const handleRoundDec = () => {
    room.send("round-limit", Number(roundLimit) - 1);
    setRoundLimit((prevVal) => prevVal - 1);
  };
  const handleTimeInc = () => {
    room.send("time-limit", Number(timeLimit) + 1);
    setTimeLimit((prevVal) => prevVal + 1);
  };
  const handleTimeDec = () => {
    room.send("time-limit", Number(timeLimit) - 1);
    setTimeLimit((prevVal) => prevVal - 1);
  };
  const handleTeamInc = () => {
    room.send("team-limit", Number(teamLimit) + 1);
    setTeamLimit((prevVal) => prevVal + 1);
  };
  const handleTeamDec = () => {
    room.send("team-limit", Number(teamLimit) - 1);
    setTeamLimit((prevVal) => prevVal - 1);
  };
  const handleRusherPerTeamInc = () => {
    room.send("rusherPerTeam-limit", Number(rusherPerTeamLimit) + 1);
    setRusherPerTeamLimit((prevVal) => prevVal + 1);
  };
  const handleRusherPerTeamDec = () => {
    room.send("rusherPerTeam-limit", Number(rusherPerTeamLimit) - 1);
    setRusherPerTeamLimit((prevVal) => prevVal - 1);
  };
  const handleSend = () => {
    console.log("send message");
    room.send("send-message", message ? message : "");
    setMessage("");
  };

  return (
    <>
      <div className="row m-0">
        <div className="col-10">
          <div
            className="d-flex justify-content-between"
            style={{ flexDirection: "column" }}
          >
            <div className="d-flex">
              <p className="me-2">
                <b>Player ID :</b> {username}
              </p>
              <p onClick={copyRoomCode} className="room-code me-2">
                <b>Room Code :</b> {room.id}{" "}
              </p>
              <p className="room-code me-2">
                <b>Team :</b> {teamsName ? teamsName : "Not Joined"}{" "}
              </p>
              <div
                className={
                  room?.sessionId === host && !isGameStarted ? "show" : "hide"
                }
              >
                <button
                  className="btn btn-sm btn-primary mt-1 mb-1"
                  onClick={() => {
                    handleGameStart();
                  }}
                >
                  Start Game
                </button>
              </div>
            </div>
            <div
              className={`${
                room?.sessionId === host && !isGameStarted ? "show" : "hide"
              }`}
            >
              <p>Maximum Rounds</p>
              <p>
                <button onClick={handleRoundInc}>
                  <FiPlus />
                </button>
                <input
                  type="text"
                  value={roundLimit}
                  onChange={(e) => {
                    setRoundLimit(e.target.value ? Number(e.target.value) : 0);
                    room.send(
                      "round-limit",
                      e.target.value ? Number(e.target.value) : 0
                    );
                  }}
                />
                <button onClick={handleRoundDec}>
                  <FiMinus />
                </button>
              </p>
              <p>Maximum Time for each Round</p>
              <p>
                <button onClick={handleTimeInc}>
                  <FiPlus />
                </button>
                <input
                  type="text"
                  value={timeLimit}
                  onChange={(e) => {
                    setTimeLimit(e.target.value ? Number(e.target.value) : 0);
                    room.send(
                      "time-limit",
                      e.target.value ? Number(e.target.value) : 0
                    );
                  }}
                />
                <button onClick={handleTimeDec}>
                  <FiMinus />
                </button>
              </p>
              <p>Maximum number of teams</p>
              <p>
                <button onClick={handleTeamInc}>
                  <FiPlus />
                </button>
                <input
                  type="text"
                  value={teamLimit}
                  onChange={(e) => {
                    room.send(
                      "team-limit",
                      e.target.value ? Number(e.target.value) : 0
                    );
                    setTeamLimit(e.target.value ? Number(e.target.value) : 0);
                  }}
                />
                <button onClick={handleTeamDec}>
                  <FiMinus />
                </button>
              </p>
              <p>Maximum Rushers per team</p>
              <p>
                <button onClick={handleRusherPerTeamInc}>
                  <FiPlus />
                </button>
                <input
                  type="text"
                  value={rusherPerTeamLimit}
                  onChange={(e) => {
                    room.send(
                      "rusherPerTeam-limit",
                      e.target.value ? Number(e.target.value) : 0
                    );
                    setRusherPerTeamLimit(
                      e.target.value ? Number(e.target.value) : 0
                    );
                  }}
                />
                <button onClick={handleRusherPerTeamDec}>
                  <FiMinus />
                </button>
              </p>
            </div>
          </div>
          {isGameStarted &&
            (hasTeamsFormed ? (
              <Game host={host} />
            ) : (
              <Team
                hasTeamsFormed={hasTeamsFormed}
                setHasTeamsFormed={setHasTeamsFormed}
                teamsData={teamsData}
                setTeamsData={setTeamsData}
                host={host}
                players={players}
                setPlayers={setPlayers}
                setTeamsName={setTeamsName}
              />
            ))}
        </div>
        <div className="col-2">
          <div className="leave-btn">
            <button onClick={handleLeave} className="btn btn-danger">
              leave
            </button>
          </div>
          <div className="players?">
            <h3 className="mx-3">Players</h3>
            <ul className="list-group">
              {Object.keys(players)?.map((id) => {
                return (
                  <li
                    key={id}
                    className={`list-group-item ${
                      room.sessionId === id ? "active" : ""
                    }`}
                  >
                    {`${players[id]?.username}`}
                    <span
                      className="player-color-block"
                      style={{ backgroundColor: players[id].color }}
                    ></span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="chat">
            <input
              type="text"
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSend}
              disabled={!message}
            >
              Send
            </button>
            {messages.map((msg, id) => {
              return (
                <li key={id} className="list-group-item">
                  {msg}
                </li>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameView;
