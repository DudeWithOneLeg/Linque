import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../../store/session";
import './index.css'

export default function SignupForm() {

    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);

    const [firstName, setFirstname] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
              sessionActions.signup({
                email,
                username,
                firstName,
                lastName,
                password,
              })
            ).catch(async (res) => {
              const data = await res.json();
              if (data && data.errors) {
                setErrors(data.errors);
              }
            });
          }
          return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
          });
    }

    return (
        <div id='signup-form'>
            <form onSubmit={handleSubmit}>
                <input
                onChange={(e) => setFirstname(e.target.value)}
                placeholder='First name'
                />
                    {errors.firstName && <p className='errors'>{errors.firstName}</p>}
                <input
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Last name'
                />
                    {errors.lastName && <p className='errors'>{errors.lastName}</p>}
                <input
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
                />
                    {errors.username && <p className='errors'>{errors.username}</p>}
                <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                />
                    {errors.email && <p className='errors'>{errors.email}</p>}
                <input
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                />
                    {errors.password && <p className='errors'>{errors.password}</p>}
                <input
                placeholder="Confirm Password"
                type='password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
                    {errors.confirmPassword && <p class='errors'>{errors.confirmPassword}</p>}
                <button type='submit'>Sign up</button>
            </form>
        </div>

    )
}
