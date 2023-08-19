import { useState } from "react"
import { useDispatch } from "react-redux"
import './index.css'

export default function LoginForm() {
    const dispatch = useDispatch()

    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = {credential, password}

        console.log(user)

    }

    return (
        <div id='login-form'>
            <form onSubmit={handleSubmit}>
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
            <button type='submit'>Login</button>
        </form>
        </div>

    )
}
