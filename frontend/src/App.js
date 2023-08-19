import { Switch, Route } from "react-router-dom";
import Microphone from "./components/Microphone";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigaton";

function App() {



  return (
    <>
      <Switch>

      <Route exact path='/'>
        <LandingPage />
      </Route>
    </Switch>
    </>
  );
}

export default App;
