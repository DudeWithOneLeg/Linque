import { useEffect, useState } from "react"
import * as chatBotActions from '../../store/chatbot'
import { useDispatch, useSelector } from "react-redux"
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

    const handleClick = () => {

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




            //stop recognition before audio plays


            //if expected response is audio, get new audio



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

    return (
        showBot ? <div id='chat-box'>
            <div id='chatbox-header'>
                {!showConvos && <img src='/images/back.png' onClick={() => setShowConvos(true)} id='back-button' />}
                <h4>Chat Bot</h4>
                <div id='minimize' onClick={() => setShowBot(false)}><div></div></div>
            </div>
            {showConvos ? <div>
                <div
                    onClick={() => setShowConvos(false)}
                    className="chatbot-conversation"
                >
                    <p>New</p>
                </div>
                {
                    convos && Object.values(convos).map((convo) => {

                        return <div onClick={() => {
                            dispatch(chatBotActions.getOneConvo(convo.id))
                            setShowConvos(false)
                        }}
                            className="chatbot-conversation">
                            <p>{convo.title}</p>
                        </div>
                    })
                }
            </div> : <div id='convo'>
                <div id='messages'>
                    {
                        messages && Object.values(messages).map((message) => {

                            if (message.user) {

                                return <div className="user-message">
                                    {message.body}
                                </div>
                            }
                            else {
                                if (!message.engine) {
                                    return <div className="bot-message">
                                        {message.body}
                                    </div>
                                }
                                else {

                                    if (message.data) {
                                        const result = message.data[0]
                                        if (message.engine === 'google_videos') {
                                            const videoId = result.link.split('v=')[1]
                                            return <div className="bot-message">
                                                <a href={result.link} className="link-card" target="_blank">
                                                    <div className="link-card-info">
                                                        <p>{message.body}</p>
                                                        <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>

                                                    </div>
                                                </a>
                                            </div>
                                        }
                                        if (message.engine === 'google_images') {
                                            const images = Object.values(message.data.images)
                                            return <div className="bot-message">
                                                <p>{message.body}</p>
                                            <a href={message.data.metaData.google_images_url} className="images-card" target="_blank">
                                                <div className="image-row">
                                                    {
                                                        images.slice(0,2).map((image) => {
                                                            return <img src={image.thumbnail} className="image-results"/>
                                                        })
                                                    }

                                                </div>
                                                <div className="image-row">
                                                    {
                                                        images.slice(2).map((image) => {
                                                            return <img src={image.thumbnail} className="image-results"/>
                                                        })
                                                    }

                                                </div>
                                            </a>
                                        </div>
                                        }
                                        return <div className="bot-message">
                                            <a href={result.link} className="link-card" target="_blank">
                                                <div className="link-card-info">
                                                    <p>{result.title} - {result.source}</p>
                                                    <p>{message.body}</p>
                                                </div>
                                            </a>
                                        </div>
                                    }
                                }
                            }

                        })
                    }
                </div>
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
