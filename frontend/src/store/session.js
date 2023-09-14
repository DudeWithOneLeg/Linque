import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const ADD_VOICE = "session/addVoice";

const setVoice = (voiceId) => {
  return {
    type: ADD_VOICE,
    payload: voiceId
  }
}

export const createVoice = (blob) => async (dispatch) => {
  // const base64String = btoa(String.fromCharCode.apply(null, array));
  // console.log(base64String)
  const form = new FormData()
  form.append('file', blob)
  const res = await csrfFetch('/api/users/voice', {
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
  },
    body: form
  })
  const data = await res.json()
  dispatch(setVoice(data.voice_id))
  return data
}

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password, defaultLanguage } = user;
  const newUser = {
    username,
      firstName,
      lastName,
      email,
      password,
      defaultLanguage
  }

  if (user.voice_id) newUser.voice_id = user.voice_id
  console.log(newUser)

  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(newUser),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    case ADD_VOICE:
      return {...state, voice_id: action.payload}
    default:
      return state;
  }
};

export default sessionReducer;
