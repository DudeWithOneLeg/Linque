import { Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "./store/session";
import Microphone from "./components/Microphone";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigaton";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);


  return (
    <>
      <Switch>
        <Route exact path='/'>
          {sessionUser && <Navigation />}
          <LandingPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
