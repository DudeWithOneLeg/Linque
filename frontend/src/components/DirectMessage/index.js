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
    const [translate, setTranslate] = useState(false)
    const [show, setShow] = useState(false)

    return (
        <div id='direct-message'>
            <div id='dm-header'>
                {showConvo && show && <img src='/images/icons/back.png' onClick={() => {setShowConvo(false);}} id='dm-back'/>}
                <p onClick={() => {setShow(!show); setShowConvo(showConvo)}}>Direct Messages</p>
                {showConvo && show && <img src='/images/icons/translate.png' id='translate-toggle' onClick={() => setTranslate(!translate)} className={translate ? 'translate-toggle-active' : ''}/>}
            </div>
            {show && <div id='dm-main'>
                {!showConvo && <FriendsList setShowConvo={setShowConvo} setSelectedFriend={setSelectedFriend} setRoom={setRoom}/>}
                {showConvo && <UserConvo selectedFriend={selectedFriend} room={room} translate={translate}/>}
            </div>}
        </div>
    )
}
