import { GameProvider } from "./store/GameContext";
import { Toaster } from "react-hot-toast";
import Home from "./views/Home";
import GameView from "./views/GameView";
import Join from "./views/Join";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GuardedRoute from "./views/GuardedRoute";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Info from "./views/Info";
import CreateAsFacilitator from "./views/CreateAsFacilitator";
import CreateAsHost from "./views/CreateAsHost";

function App() {
  return (
    <>
      <h1 className="text-center">Color Rush</h1>
      <Provider store={store}>
        <GameProvider>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/join/:roomCode?" component={Join} />
              <Route
                path="/create-as-facilitator"
                component={CreateAsFacilitator}
              />
              <Route path="/create-as-host" component={CreateAsHost} />
              <Route path="/info" component={Info} />

              <GuardedRoute path="/game" component={GameView} />
            </Switch>
          </Router>
        </GameProvider>
      </Provider>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
