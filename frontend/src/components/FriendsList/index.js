import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import * as friendActions from '../../store/friends'
import { io } from "socket.io-client"

export default function FriendsList({setShowConvo, setSelectedFriend, setRoom}) {

    const socket = io('http://localhost:8000');
    const dispatch = useDispatch()
    const friends = useSelector(state => state.friend.allFriends)

    useEffect(() => {
        dispatch(friendActions.getFriends())
    }, [dispatch])

    const handleClick = (friendship) => {
        setShowConvo(true);
        setSelectedFriend(friendship);
        socket.emit('join room', {room: friendship.id})
    }

    return (
        <div id='friends-list'>
            {
                Object.values(friends).length ? Object.values(friends).map((friendship) => {
                    const friend = friendship.toUser ? friendship.toUser : friendship.fromUser
                    return <div onClick={() => handleClick(friendship)} key={friendship.id}>

                        <p>{friend.firstName} {friend.lastName}</p>
                    </div>
                }) : <></>
            }
        </div>
    )
}
