import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as speechActions from '../../store/speech'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './index.css'

export default function Microphone({ soundRef, defaultLanguage }) {
    const [mic, setMic] = useState(false)
    const dispatch = useDispatch()
    const {
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    //Enable mic after welcome audio
    if (soundRef.current) {
        soundRef.current.addEventListener('ended', () => {
            tglMic()
        })
    }

    //Update the state with speech input
    useEffect(() => {

        console.log('Listening: ', listening, finalTranscript)

        if (listening && finalTranscript) {
            console.log(finalTranscript)
            dispatch(speechActions.setSpeech(finalTranscript))
        }

    }, [dispatch, finalTranscript])

    //Keep speech recognition on when mic enabled
    useEffect(() => {
        if (!listening && mic) {
            const options = {}
            if (defaultLanguage) options.language = defaultLanguage
            SpeechRecognition.startListening(options)
        }
    }, [listening])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }


    async function tglMic() {
        console.log('toggle')
        if (mic) {
            setMic(false)
            console.log('off')
            SpeechRecognition.stopListening()
        }
        else {
            setMic(true)
            console.log('on')
            SpeechRecognition.startListening()
        }
        return
    }

    return (
        <>
            <img
                id='microphone'
                src='/images/microphone.png'
                alt='mircophone'
                onClick={() => tglMic()}
                style={listening ? { backgroundColor: 'rgb(152, 74, 74)'} : {}}
            />
        </>

    )
}
