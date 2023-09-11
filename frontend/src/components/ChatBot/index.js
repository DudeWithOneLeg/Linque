import { useEffect, useState } from "react"
import * as chatBotActions from '../../store/chatbot'
import { useDispatch, useSelector } from "react-redux"
import ViewChatBotConvos from "../ViewChatBotConvos"
import ViewChatBotMessages from "../ViewChatBotMessages"
import './index.css'

export default function ChatBot() {

    const [body, setBody] = useState('')
    const [showBot, setShowBot] = useState(false)
    const [showConvos, setShowConvos] = useState(true)
    const dispatch = useDispatch()

    const convos = useSelector(state => state.chatBot.allConvos)
    const messages = useSelector(state => state.chatBot.singleConvo)

    const messageDiv = document.getElementById('messages')



    if (messageDiv) {
        messageDiv.scrollTop = messageDiv.scrollHeight
    }

    const handleClick = async () => {


        const newBody = { body: body, user: true }
        if (messages) {
            newBody.chatBotConvoId = Object.values(messages)[0].chatBotConvoId
        }
        console.log(newBody)
        dispatch(chatBotActions.createMessage(newBody)).then(async () => {
            const div = document.createElement("div");
            div.className = 'bot-message'
            messageDiv.appendChild(div)

            let audio;

            //fetch new audio
            const data = await fetch('/audio/audio.mp3');

            //parse audio
            const arrayBuffer = await data.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
            const newUrl = window.URL.createObjectURL(blob);

            //set audio
            audio = document.createElement("audio");
            audio.id = "audio";
            audio.src = newUrl;
            audio.load();
            audio.playbackRate = .9;
            audio.setAttribute("controls", "");
            console.log(audio.duration)
            audio.style.height = '30px'

            //append audio
            div.appendChild(audio);
            messageDiv.scrollTop = messageDiv.scrollHeight

            //start recognition when audio ends
            audio.play()

        })


        setBody('')
    }

    useEffect(() => {
        dispatch(chatBotActions.getAllConvos())
    }, [dispatch])

    useEffect(() => {
        if (messageDiv) {

            messageDiv.scrollTop = messageDiv.scrollHeight
        }

    }, [messages])

    useEffect(() => {
        if (showConvos) {
            const audios = document.getElementsByClassName('bot-message')
            if (audios) {
                for (let el of audios) {
                    el.hidden = true
                }
            }
        }
    }, [showConvos])


    return (
        showBot ? <div id='chat-box'>
            <div id='chatbox-header'>
                {!showConvos && <img src='/images/back.png' onClick={() => {setShowConvos(true); dispatch(chatBotActions.getAllConvos())}} id='back-button' />}
                <h4>Chat Bot</h4>
                <div id='minimize' onClick={() => setShowBot(false)}><div></div></div>
            </div>
            {showConvos ? <div>
                <div
                    onClick={() => { setShowConvos(false); dispatch(chatBotActions.clearMessages())}}
                    className="chatbot-conversation"
                >
                    <p>New</p>
                </div>
                {
                    convos && Object.values(convos).map((convo) => {

                        return <ViewChatBotConvos convo={convo} setShowConvos={setShowConvos}/>
                    })
                }
            </div> : <div id='convo'>

                <ViewChatBotMessages messages={messages}/>
                <div id='input-div'>
                    <textarea
                        id='chatbox-text-input'
                        onChange={(e) => setBody(e.target.value)}
                        value={body}
                    />
                    <img src='/images/send.png' id='send-message-button' onClick={handleClick} />
                </div>
            </div>}
        </div> : <div id='bot-button' onClick={() => setShowBot(true)}>
            <h2>Bot</h2>
        </div>
    )
}
