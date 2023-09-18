import SearchBar from "../SearchBar"
import ViewUsers from "../ViewUsers"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import * as friendActions from '../../store/friends'
import './index.css'

export default function Search() {

    const dispatch = useDispatch()

    const users = useSelector(state => state.friend.users)
    const [currUser, setCurrUsers]= useState(users || null)

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(friendActions.getUsers())

    }, [dispatch])

    return (
        <div id='search'>
            <SearchBar setSearchTerm={setSearchTerm}/>
            {users && <ViewUsers searchTerm={searchTerm} users={users}/>}
        </div>
    )
}
