import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useGoogleLogin } from '@react-oauth/google';
import * as sessionActions from '../../store/session'
import { csrfFetch } from '../../store/csrf';
import axios from 'axios'
import './index.css'
import { useDispatch } from 'react-redux';

export default function GoogleLoginComp({setSignup}) {

  const dispatch = useDispatch()

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      console.log(tokenResponse)
      await dispatch(sessionActions.oauth(tokenResponse.access_token))
      setSignup(true)
    },
  });

  return (
    <button id='google-sign-up' onClick={() => login()}>
      <img src='/images/google.png' id='google-logo'/>
    </button>
  )

}
