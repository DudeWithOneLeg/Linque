import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as speechActions from '../../store/speech'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Microphone() {

        const dispatch = useDispatch()



    const [mic, setMic] = useState(false)

    const {
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        dispatch(speechActions.setSpeech(finalTranscript))
    },[dispatch, finalTranscript])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }


    //////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////

    async function tglMic() {

        if (mic) {
            setMic(false)
            SpeechRecognition.stopListening()
        }
        else {
            setMic(true)
            SpeechRecognition.startListening()
        }
        return
    }

    return (
        <>
            <button
                onClick={() => tglMic()}
                style={listening ? { backgroundColor: 'black', color: 'white' } : { backgroundColor: 'white' }}
            >Mic</button>
        </>

    )
}
