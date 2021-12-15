import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "../store/GameContext";

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
}) => {
  const { room, client } = useContext(GameContext);
  const [chosen, setChosen] = useState(false);
  const [hasEveryoneJoinedTeam, setHasEveryoneJoinedTeam] = useState(false);
  const [disableTeamJoin, setDisableTeamJoin] = useState([]);
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
      <p>
        <h1>Form teams</h1>
        {room?.sessionId === host && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setHasTeamsFormed(true);
              room.send("teams-formed", true);
            }}
            disabled={!hasEveryoneJoinedTeam}
          >
            Create
          </button>
        )}
      </p>
      {teamsData?.teams?.map((arr, id) => {
        return (
          <button
            className="btn btn-sm"
            disabled={chosen || room.sessionId === host}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <li
              className="list-group-item"
              key={id}
              // disabled={disableTeamJoin.includes(id)}
              onClick={() => {
                room.send("join-team", id);
              }}
            >
              Team {id} {arr}
            </li>
          </button>
        );
      })}
    </>
  );
};

export default Team;
