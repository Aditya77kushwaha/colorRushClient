import React from "react";

function GameOver({ gameEndDetails, players, guessed }) {
  function Winner({ details }) {
    console.log("deatils", details);
    return Object.keys(details.data).map((item) => {
      return <p>{item !== "rgb" && item + ":" + details.data[item]}</p>;
    });
  }
  return (
    <>
      <h4>Game over!!! </h4>
      <br />
      <h5>Winner is </h5>
      {gameEndDetails.winners.map((winner) => (
        <Winner details={winner} />
      ))}
      <br />
      <h5>Score Board</h5>
      {Object.keys(players)?.map((id) => {
        return (
          <>
            <div key={id}>
              <p>
                {guessed.includes(players[id]?.username) &&
                  `Username : ${players[id]?.username}`}
              </p>
              <p>
                {guessed.includes(players[id]?.username) &&
                  `Team : ${players[id]?.team}`}
              </p>
              <p>
                {guessed.includes(players[id]?.username) &&
                  `Score : ${players[id]?.score}`}
              </p>
            </div>
            <br />
          </>
        );
      })}
    </>
  );
}
export default GameOver;
