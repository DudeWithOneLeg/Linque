import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import * as messageActions from '../../store/messages'
import { io } from "socket.io-client"
import { languageCodes } from '../SignupForm/index.css/languages';
import './index.css'

const KEY = process.env.REACT_APP_SOCKET_KEY

export default function UserConvo({ selectedFriend, translate }) {

    const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)
    const messages = useSelector(state => state.message.allMessages)
    const socket = io('http://localhost:8000');
    const [message, setMessage] = useState({})
    const [body, setBody] = useState('')

    const friend = selectedFriend.toUser ? selectedFriend.toUser : selectedFriend.fromUser
    const room = friend.id

    const handleSubmit = async () => {
        const messageDiv = document.getElementById('user-conversation')
            console.log('this hit')
        const message = {
            body,
            room,
            senderId: user.id,
            convoId: selectedFriend.id,
            voice_id: user.voice_id,
            friendLanguage: friend.defaultLanguage,
            defaultLanguage: user.defaultLanguage,
            translate
        }

        socket.emit('chat message', (message))

        await dispatch(messageActions.setMessage({
            body: message.body,
            senderId: user.id,
            convoId: selectedFriend.id
        }))
        messageDiv.scrollTop = messageDiv.scrollHeight
    }



    useEffect(() => {

        socket.on('connect', () => {
            socket.emit('join room', { room: user.id });

            socket.on('chat message', (message) => {
                console.log(message)
                const messageDiv = document.getElementById('user-conversation')
                const newMessage = {
                    body: message.body,
                    senderId: message.senderId,
                    convoId: message.convoId,
                    language: message.language
                }

                if (message.audio) {
                    newMessage.audio = message.audio
                }

                dispatch(messageActions.setMessage(newMessage))
                messageDiv.scrollTop = messageDiv.scrollHeight
            });
        })

    }, [])

    useEffect(() => {
        dispatch(messageActions.getMessages(selectedFriend.id))
    }, [dispatch])



    return (
        <div id='user-convo'>

            <div id='user-conversation'>
                {
                    messages && Object.values(messages).length && Object.values(messages).map((message) => {
                        if (message.senderId !== user.id) {
                            return <div className="bot-message-container">
                                <p className="user-message-language">{message.language ? languageCodes[message.language] : ''}</p>
                                <div className="bot-message">
                                    {message.body}
                                    {
                                        message.audio ? <audio src={message.audio} controls playbackRate={.9}/> : <></>
                                    }
                                </div>
                            </div>
                        }
                        else {
                            return <div className="user-message-container">
                                <p className="friend-message-language">{message.language ? languageCodes[message.language] : ''}</p>
                                <div className="user-message">
                                    {message.body}
                                    {
                                        message.audio ? <audio src={message.audio} autoPlay controls/> : <></>
                                    }
                                </div>
                            </div>
                        }
                    })
                }
            </div>
            <div id='dm-input-container'>
                <textarea onChange={(e) => setBody(e.target.value)} id='dm-input' />
                <img src='/images/send.png' onClick={handleSubmit} id='dm-send' />
            </div>
        </div>
    )
}
