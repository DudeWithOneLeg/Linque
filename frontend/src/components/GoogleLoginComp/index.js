
import { useGoogleLogin } from '@react-oauth/google';
import * as sessionActions from '../../store/session'
import './index.css'
import { useDispatch } from 'react-redux';

export default function GoogleLoginComp({setSignup}) {

  const dispatch = useDispatch()

  console.log(useGoogleLogin)

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
