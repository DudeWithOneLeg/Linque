import { NavLink } from "react-router-dom"
import Logo from "../Logo"
import './index.css'

export default function Navigation({setLogin, setSignup}) {
    return (
        <nav id='navigation'>
            <div>
                <Logo />
            </div>
            <div id='login-signup'>
                    <a
                    onClick={() => {setSignup(false); setLogin(true)}}>
                    <h1>Login</h1>
                    </a>

                    <a onClick={() => {setLogin(false); setSignup(true)}}>
                    <h1

                    >Sign Up</h1>
                    </a>

            </div>

        </nav>
    )
}
