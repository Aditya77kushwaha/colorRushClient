import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "../store/GameContext";
import "./game.css";
import "./team.css";

// players would form teams here
const Team = ({
  hasTeamsFormed,
  setHasTeamsFormed,
  teamsData,
  setTeamsData,
  host,
  players,
  setPlayers,
  setTeamsName,
  rushers,
  clueGivers,
  setRushers,
  setClueGivers,
}) => {
  const { room, client } = useContext(GameContext);
  const [chosen, setChosen] = useState(false);
  const [hasEveryoneJoinedTeam, setHasEveryoneJoinedTeam] = useState(false);
  const [disableTeamJoin, setDisableTeamJoin] = useState([]);
  // const [rushers, setRushers] = useState([]);
  useEffect(() => {
    room.onMessage("everyone-joined-team", (msg) => {
      setHasEveryoneJoinedTeam(true);
    });
    room.state.players.onChange = (player, sessionId) => {
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [sessionId]: {
          username: player.username,
        },
      }));
      player.onChange = (changes) => {
        changes.forEach((change) => {
          setPlayers((prevPlayers) => {
            const newPlayersState = { ...prevPlayers };
            newPlayersState[sessionId][change.field] = change.value;
            if (change.field === "team" && client.id === sessionId) {
              setTeamsName(change.value);
              // setChosen(true);
            }
            return newPlayersState;
          });
        });
      };
      // player.triggerAll()
    };
    room.onMessage("join-teams", (msg) => {
      console.log("Formed teams...");
      // console.log("disableTeamJoin", disableTeamJoin);
      setTeamsData(msg);
    });
    room.onMessage("joined-team", (msg) => {
      setChosen(true);
      setTeamsName("Team " + msg);
    });
    room.onMessage("cant-join-teams", (msg) => {
      setDisableTeamJoin((prevVal) => [...prevVal, msg]);
      console.log("disableTeamJoin", disableTeamJoin);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="teamPageHeader text-center py-3">
        <h2>Join Your Team</h2>
      </div>

      {/* {room?.sessionId === host && (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            setHasTeamsFormed(true);
            let cluegivers = [];
            cluegivers = Object.keys(players)?.filter((id) => {
              return (
                !rushers.includes(players[id]?.username) &&
                players[id]?.username
                // setClueGivers((prevVal) => [
                //   ...prevVal,
                //   players[id]?.username,
                // ])
              );
            });
            // setClueGivers(cluegivers);

            console.log("Rushers are", rushers);
            console.log("clue givers are", cluegivers);
            room.send("teams-formed", {
              rushers: rushers,
              clueGivers: cluegivers,
            });
          }}
          disabled={!hasEveryoneJoinedTeam}
        >
          Create
        </button>
      )} */}
      <div className="container-fluid">
        <div className="row my-3">
          {teamsData?.teams?.map((arr, id) => {
            return (
              <div
                className="col-sm-4 mt-3"
                disabled={chosen && room.sessionId !== host}
                style={{ display: "flex", flexDirection: "column" }}
                key={id}
              >
                <div className="teamDiv">
                  <div
                    className="teamHeader"
                    key={id}
                    // disabled={disableTeamJoin.includes(id)}
                    onClick={() => {
                      if (room.sessionId !== host && !chosen)
                        room.send("join-team", id);
                    }}
                  >
                    <h3>Team {id + 1}</h3>
                    <small style={{ fontWeight: "700" }}>
                      {room.sessionId === host &&
                        `(choose ${Math.floor(
                          arr.length / 2
                        )} or more rushers)`}
                    </small>
                    <br />
                    {arr.map((rusher, idx) => {
                      return (
                        <div
                          className={`room-code ${
                            rushers.includes(rusher) && "text-danger"
                          }`}
                          onClick={() => {
                            if (room.sessionId === host)
                              setRushers((prevVal) => [...prevVal, rusher]);
                          }}
                          key={idx}
                        >
                          {rusher}
                        </div>
                      );
                    })}
                  </div>
                  {/* <ul className="players-list">
                    {arr.map((player, index) => (
                      <li key={index}>{player}</li>
                    ))}
                  </ul> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {room?.sessionId === host && (
        <div className="text-center">
          <button
            className="cr-btn"
            onClick={() => {
              setHasTeamsFormed(true);
              let cluegivers = [];
              cluegivers = Object.keys(players)?.filter((id) => {
                return (
                  !rushers.includes(players[id]?.username) &&
                  players[id]?.username
                  // setClueGivers((prevVal) => [
                  //   ...prevVal,
                  //   players[id]?.username,
                  // ])
                );
              });
              // setClueGivers(cluegivers);

              console.log("Rushers are", rushers);
              console.log("clue givers are", cluegivers);
              room.send("teams-formed", {
                rushers: rushers,
                clueGivers: cluegivers,
              });
            }}
            disabled={!hasEveryoneJoinedTeam}
          >
            Start Game
          </button>
        </div>
      )}

      {/* {teamsData?.teams?.map((arr, id) => {
        return (
          <div
            className="player-squares-container"
            disabled={chosen && room.sessionId !== host}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <li
              className="list-group-item"
              key={id}
              // disabled={disableTeamJoin.includes(id)}
              onClick={() => {
                if (room.sessionId !== host && !chosen)
                  room.send("join-team", id);
              }}
              style={{ minWidth: "250px" }}
            >
              Team {id}{" "}
              <small style={{ fontWeight: "700" }}>
                {room.sessionId === host &&
                  `(choose ${Math.floor(arr.length / 2)} or more rushers)`}
              </small>
              <br />
              {arr.map((rusher, idx) => {
                return (
                  <div
                    className={`room-code ${
                      rushers.includes(rusher) && "text-danger"
                    }`}
                    onClick={() => {
                      if (room.sessionId === host)
                        setRushers((prevVal) => [...prevVal, rusher]);
                    }}
                    key={idx}
                  >
                    {rusher}
                  </div>
                );
              })}
            </li>
          </div>
        );
      })} */}
    </>
  );
};

export default Team;
