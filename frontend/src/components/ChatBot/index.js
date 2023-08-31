import { useEffect, useState } from "react"
import * as chatBotActions from '../../store/chatbot'
import { useDispatch, useSelector } from "react-redux"
import './index.css'

export default function () {
    const [body, setBody] = useState('')
    const [showBot, setShowBot] = useState(false)
    const [showConvos, setShowConvos] = useState(true)
    const dispatch = useDispatch()

    const convos = useSelector(state => state.chatBot.allConvos)
    const messages = useSelector(state => state.chatBot.singleConvo)

    const messageDiv = document.getElementById('messages')

        if (messageDiv) {
            messageDiv.scrollTop = messageDiv.scrollHeight
            console.log(messageDiv.scrollHeight, messageDiv.scrollTop)
        }

    const handleClick = () => {

        const newBody = { body: body, user: true }
        if (messages) {
            newBody.chatBotConvoId = Object.values(messages)[0].chatBotConvoId
        }
        console.log(newBody)
        dispatch(chatBotActions.createMessage(newBody))
        const messageDiv = document.getElementById('messages')


        setBody('')
    }

    useEffect(() => {
        dispatch(chatBotActions.getAllConvos())
    }, [dispatch])

    useEffect(() => {
        if (messageDiv) {

            messageDiv.scrollTop = messageDiv.scrollHeight
            console.log(messageDiv.scrollHeight, messageDiv.scrollTop)
        }

    }, [messages])

    return (
        showBot ? <div id='chat-box'>
            <div id='chatbox-header'>
                <h4>Chat Bot</h4>
                <div id='minimize' onClick={() => setShowBot(false)}><div></div></div>
            </div>
            {showConvos ? <div>
                {
                    convos && Object.values(convos).map((convo) => {

                        return <div onClick={() => {
                            dispatch(chatBotActions.getOneConvo(convo.id))
                            setShowConvos(false)
                        }}>
                            {convo.title}
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
                                return <div className="bot-message">
                                {message.body}
                            </div>
                            }

                        })
                    }
                </div>
                <div>
                <textarea
        id='chatbox-text-input'
        onChange={(e) => setBody(e.target.value)}
        value={body}
        />
        <button onClick={handleClick}>Send</button>
                </div>
            </div>}
        </div> : <div id='bot-button' onClick={() => setShowBot(true)}>
            <h2>Bot</h2>
        </div>
    )
}
