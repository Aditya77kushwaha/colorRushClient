import React from "react";
import { useHistory } from "react-router-dom";

const Info = () => {
  const history = useHistory();

  return (
    <div>
      <h3 className="text-center">Game Info</h3>
      <p>
        <b> Game Mechanics</b>
        <ul>
          <li>
            3 mins given, in which all players have to play, players can play
            unlimited rounds.
          </li>
          <li>
            1 player would be the Rusher and the remaining 5 be the Clue givers
            or vice versa or can be divided however the host wants.
          </li>
          <li>The Rushers can place the marker and guess the color.</li>
          <li>
            On reaching a certain score (Benchmark) the team will be applauded.
          </li>
        </ul>
      </p>
      <p>
        <b> Scoring</b>
        <ul>
          <li>The exact guess of color will fetch 6 points.</li>
          <li>One grid apart would fetch 4 points.</li>
          <li>A two-grids apart would fetch 2 points.</li>
          <li>
            On reaching Benchmarks the team will be applauded (If the team
            scores maximum score (36 points) then they’ll be shown a notify
            SUPER GOOD )
          </li>
        </ul>
      </p>
      <p>
        <b> Skills Utilized</b>
        <ul>
          <li>Critical thinking</li>
          <li>Adaptability</li>
          <li>Communication skills</li>
          <li>Team building</li>
        </ul>
      </p>
      <p>
        <b>Rule Book</b>
        <li>
          <a href="https://docs.google.com/document/d/1pQKkmeCOaHjLuD4R8tE2pbkF9nVGLErTLeYoQURzK_8/edit">
            Color Rush Game Play Rules
          </a>
        </li>
      </p>
      <h6 className="text-primary room-code">
        <b
          onClick={() => {
            history.push("/");
          }}
        >
          Go back
        </b>
      </h6>
    </div>
  );
};

export default Info;
