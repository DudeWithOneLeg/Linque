import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from "./session";
import { speechReducer } from './speech';
import { postsReducer } from './posts';
import { ChatBotReducer } from './chatbot';
import { mapReducer } from './googleMaps';

const rootReducer = combineReducers({
  session: sessionReducer,
  speech: speechReducer,
  posts: postsReducer,
  chatBot: ChatBotReducer,
  map: mapReducer
});



let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };

  export default configureStore;
