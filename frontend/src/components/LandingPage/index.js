import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import './index.css'
import LoginForm from "../LoginForm"
import SignupForm from "../SignupForm/index.css"
import Navigation from "../Navigaton"
import Microphone from "../Microphone"
import Feed from "../Feed"
import GoogleLoginComp from "../GoogleLoginComp"
import { io } from "socket.io-client"

export default function LandingPage() {

    // const socket = io('http://localhost:8000');

    const speech = useSelector(state => state.speech.speech)
    const soundRef = useRef(null)
    const [login, setLogin] = useState(false)
    const [signup, setSignup] = useState(false)
    const [domErr, setDomErr] = useState(null)


    const sessionUser = useSelector(state => state.session.user)

    // socket.on('chat message', (message) => {
    //     console.log(message)
    //     console.log(`${sessionUser.firstName} recieved ${message.body}`);
    // });

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
        console.log(login)
    },[login])


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

            {!sessionUser && <div id='get-started-container'>
                <Navigation setLogin={setLogin} setSignup={setSignup} />
                {/* <audio ref={soundRef} id='audio' src='/audio/welcome.mp3' preload="auto">

                </audio> */}
                {!signup && <div id='landing-title-container'>
                    <p id='landing-title'>Linque</p>
                    {
                    domErr && <button
                        id='get-started'
                        onClick={() => handleGetStarted()}
                    >Get Started</button>
                }

                    <LoginForm setSignup={setSignup}/>

                </div>}
                
                {
                    signup && ! sessionUser && <SignupForm />
                }
                </div>} {
                // !sessionUser && <div id='landing-mic'>
                //     <Microphone soundRef={soundRef} />
                // </div>
            }
            {!sessionUser && <img id='landing-img' src='/images/icons/landing-img.jpg'/>}

        </div>
    )
}
