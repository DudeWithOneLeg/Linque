import { useState } from "react"
import { useGoogleOneTapLogin } from "@react-oauth/google";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import './index.css'

export default function LoginForm({setSignup}) {
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);

    const [errors, setErrors] = useState({});
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")

    useGoogleOneTapLogin({
        onSuccess: async credentialResponse => {
            const newUser = jwt_decode(credentialResponse.credential)
            await dispatch(sessionActions.oauth(newUser))
            setSignup(true)
        },
        onError: () => {
          console.log('Login Failed');
        },
        
      });

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = {
            credential,
            password
        }

        setErrors({});
    return dispatch(sessionActions.login(user)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );

    }

    return (
        <div id='login-component'>
            <form onSubmit={handleSubmit} id='login-form'>
                <input
                type='text'
                placeholder='Usrname or Email'
                onChange={(e) => setCredential(e.target.value)}
                />
                <input
                placeholder="Password"
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                />
                {errors.credential && <p class='errors'>{errors.credential}</p>}
                <button
                className="example" type='submit'>Login</button>
                <button
                className="example" type='submit' onClick={() => dispatch(sessionActions.login({
                    credential: 'demo@lition.com',
                    password: 'password'
                }))}>Demo Login</button>
            </form>
        </div>

    )
}
