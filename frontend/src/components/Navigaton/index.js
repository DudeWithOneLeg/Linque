import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"
import Logo from "../Logo"
import './index.css'
import ProfileDropdown from "../ProfileDropdown"

export default function Navigation({ setLogin, setSignup, setSearch, search }) {

    const sessionUser = useSelector(state => state.session.user)



    return (
        <div id='navigation'>

            <Logo />
            {!sessionUser && <div id='login-signup'>
                <a
                    onClick={() => { setSignup(false); setLogin(true) }}>
                    <h1>Login</h1>
                </a>

                <a onClick={() => { setLogin(false); setSignup(true) }}>
                    <h1

                    >Sign Up</h1>
                </a>

            </div>}
            {
                sessionUser && <div id='nav-icon-container'>
                    <div onClick={() => setSearch(false)}>
                        {!search && <img src='/images/icons/home.png' className='nav-page-icon'/>}
                        {search && <img src='/images/icons/home-outline.png' className='nav-page-icon'/>}

                    </div>
                    <div onClick={() => setSearch(true)}>
                        {search && <img src='/images/icons/find-friends.png' className='nav-page-icon' />}
                        {!search && <img src='/images/icons/find-friends-outline.png' className='nav-page-icon' />}

                    </div>
                </div>
            }
            {
                sessionUser && <ProfileDropdown sessionUser={sessionUser} />
            }

        </div>
    )
}
