import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { GameContext } from "../store/GameContext";

const GuardedRoute = ({ component: Component, ...rest }) => {
  const { room } = useContext(GameContext);
  console.log("auth:" + room?.id);
  return (
    <Route
      {...rest}
      render={(props) =>
        room?.id ? <Component {...props} /> : <Redirect to="/join" />
      }
    />
  );
};

export default GuardedRoute;
