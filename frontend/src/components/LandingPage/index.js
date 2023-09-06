import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import './index.css'
import LoginForm from "../LoginForm"
import SignupForm from "../SignupForm/index.css"
import Navigation from "../Navigaton"
import Microphone from "../Microphone"
import Feed from "../Feed"

export default function LandingPage() {

    const speech = useSelector(state => state.speech.speech)
    const soundRef = useRef(null)
    const [login, setLogin] = useState(false)
    const [signup, setSignup] = useState(false)
    const [domErr, setDomErr] = useState(null)

    const sessionUser = useSelector(state => state.session.user)

    //Open login forms on user command
    useEffect(() => {
        if (speech) {

            console.log(speech.toLowerCase().includes('log') && speech.toLowerCase().includes('in'))
        }
        if (speech && speech.length && speech.toLowerCase().includes('log') && speech.toLowerCase().includes('in')) {
            setSignup(false);
            setLogin(true);
            setDomErr(null)
        }
        if (speech && speech.length && speech.toLowerCase().includes('sign')) {
            setSignup(true);
            setLogin(false);
            setDomErr(null)
        }

    }, [speech])


    useEffect(() => {
        if (soundRef.current) {

            soundRef.current.playbackRate = '.8'
            soundRef.current.play().catch(err => {
                console.log(err)
                setDomErr(err)
            })
        }

    }, [soundRef])



    const handleGetStarted = () => {
        setDomErr(null)
        console.log(soundRef.current.autoplay)
        soundRef.current.load()
        return soundRef.current.play()
    }

    return (
        <div id='landing-page'>

            {
                sessionUser && <Feed />
            }
            {!sessionUser && <div id='get-started-container'>
                <Navigation setLogin={setLogin} setSignup={setSignup} />
                <audio ref={soundRef} id='audio' src='/audio/welcome.mp3' preload="auto">

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
                {
                    domErr && !signup && !login && <button
                        id='get-started'
                        onClick={() => handleGetStarted()}
                    >Get Started</button>
                }</div>}
            <Microphone soundRef={soundRef} />
        </div>
    )
}
