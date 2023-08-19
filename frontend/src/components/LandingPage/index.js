import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import './index.css'
import LoginForm from "../LoginForm"
import SignupForm from "../SignupForm/index.css"
import Navigation from "../Navigaton"
import Microphone from "../Microphone"

export default function LandingPage() {

    const speech = useSelector(state => state.speech.speech)

    useEffect(() => {
        console.log(speech)
        if (speech.toLowerCase() === 'login') {
            setSignup(false);
            setLogin(true);
        }
        if (speech.toLowerCase() === 'signup') {
            setSignup(true);
            setLogin(false);
        }

    }, [speech])

    const [login, setLogin] = useState(false)
    const [signup, setSignup] = useState(false)

    useEffect(()  => {
        const audio = document.getElementById('audio')
        audio.playbackRate = '.8'
    },[])

    return (
        <div id='landing-page'>
            <Navigation setLogin={setLogin} setSignup={setSignup}/>
            <audio id='audio'src='/audio/welcome.mp3' preload="auto">

            </audio>
            <div id='landing-title-container'>
                <p id='landing-title'>Linque</p>
            </div>
            {
                login === true && <LoginForm />
            }
            {
                signup === true && <SignupForm />
            }
            <Microphone />
        </div>
    )
}
