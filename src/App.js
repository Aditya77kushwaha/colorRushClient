import { GameProvider } from "./store/GameContext";
import { Toaster } from "react-hot-toast";
import Home from "./views/Home";
import GameView from "./views/GameView";
import Join from "./views/Join";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GuardedRoute from "./views/GuardedRoute";
import { Provider } from "react-redux";
import { store } from "./store/store";

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
