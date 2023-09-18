import { Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "./store/session";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigaton";
import ChatBot from "./components/ChatBot";
import DirectMessage from "./components/DirectMessage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginComp from "./components/GoogleLoginComp";
import Feed from "./components/Feed";
import Search from "./components/Search";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState(false)

  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);




  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Switch>
        <Route exact path='/'>
          {sessionUser && <Navigation setSearch={setSearch} search={search}/>}
          {!sessionUser && <LandingPage />}
          {sessionUser && !search && <Feed />}
          {sessionUser && !search && <ChatBot />}
          {sessionUser && !search && <DirectMessage />}
          {sessionUser && search && <Search />}
          {sessionUser && <img id='landing-img' src='/images/icons/home-img.webp'/>}
        </Route>
        {/* <Route exact path='/oauth/callback'>
          <GoogleLoginComp />
        </Route> */}
      </Switch>
      </GoogleOAuthProvider>
  );
}

export default App;
