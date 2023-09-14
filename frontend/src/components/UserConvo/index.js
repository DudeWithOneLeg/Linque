import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import * as messageActions from '../../store/messages'
import { io } from "socket.io-client"
import './index.css'

const KEY = process.env.REACT_APP_SOCKET_KEY

export default function UserConvo({ selectedFriend }) {

    const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)
    const messages = useSelector(state => state.message.allMessages)
    const socket = io('http://localhost:8000');
    const [message, setMessage] = useState({})
    const [body, setBody] = useState('')

    const friend = selectedFriend.toUser ? selectedFriend.toUser : selectedFriend.fromUser
    const room = friend.id

    const handleSubmit = () => {
        const message = {
            body,
            room: friend.id,
            senderId: user.id,
            convoId: selectedFriend.id
        }
        socket.emit('chat message', (message))
    }



    // //Emit events to the server
    // useEffect(() => {
    //     socket.on('connect', () => {
    //         socket.emit('join room', { room, key: KEY });
    //         // socket.to(KEY + selectedFriend.id).emit('chat message', selectedFriend);

    //         // Listen for events from the server
    //         socket.on('chat message', (message) => {
    //           console.log(`${user.firstName} recieved ${message}`);
    //         });
    //     })
    // },[])

    useEffect(() => {

        socket.on('connect', () => {
            socket.emit('join room', { room: user.id });

            socket.on('chat message', (message) => {
                const messageDiv = document.getElementById('user-conversation')
                dispatch(messageActions.setMessage({
                    body: message.body,
                    senderId: user.id,
                    convoId: selectedFriend.id
                }))
                messageDiv.scrollTop = messageDiv.scrollHeight
                console.log(message)
                console.log(`${user.firstName} recieved ${message.body}`);
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
                            return <div className="user-message-container">
                                    <p className="friend-message-language">language</p>
                                    <div className="user-message">
                                        {message.body}
                                    </div>
                                </div>
                        }
                        else {
                            return <div className="bot-message-container">
                                <p className="user-message-language">language</p>
                                <div className="bot-message">
                                    {message.body}
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
