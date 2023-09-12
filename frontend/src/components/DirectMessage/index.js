import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import FriendsList from '../FriendsList'
import UserConvo from '../UserConvo'
import { io } from "socket.io-client"
import './index.css'

export default function DirectMessage() {

    const [showConvo, setShowConvo] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState({})
    const [room, setRoom] = useState(null)
    const socket = io('http://localhost:8000');

    return (
        <div id='direct-message'>
            <div id='dm-header'>
                {showConvo && <img src='/images/back.png' onClick={() => {setShowConvo(false); socket.emit('leave room', selectedFriend.id)}}/>}
                <p>Direct Messages</p>
            </div>
            <div id='dm-main'>
                {!showConvo && <FriendsList setShowConvo={setShowConvo} setSelectedFriend={setSelectedFriend} setRoom={setRoom}/>}
                {showConvo && <UserConvo selectedFriend={selectedFriend} room={room}/>}
            </div>
        </div>
    )
}
