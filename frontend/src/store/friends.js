import { csrfFetch } from './csrf'

export const flatten = (arr) => {
console.log(arr)
    const obj = {}
    for (let el of arr) {
        el.Friendship = {}
        console.log(el)
        if (el.friendshipsTo && el.friendshipsTo.length) {
            el.Friendship = el.friendshipsTo[0]
        }
        if (el.friendshipsFrom && el.friendshipsFrom.length) {
            el.Friendship = el.friendshipsFrom[0]
        }
        delete el.friendshipsFrom
        delete el.friendshipsTo

        obj[el.id] = el
    }
    return obj
}

const GET_ALL_FRIENDS = 'getFriends/all'
const GET_ALL_USERS = 'getUsers/all'
const ADD_FRIEND_REQUEST = 'postFriend/one'
const UPDATE_FRIEND_REQUEST = 'putFriend/one'

const setUsers = (users) => {
    return {
        type: GET_ALL_USERS,
        payload: users
    }
}

const setNewFriend = (friendship) => {
    return {
        type: ADD_FRIEND_REQUEST,
        payload: friendship
    }
}

const setUpdateFriend = (friendship) => {
    return {
        type: UPDATE_FRIEND_REQUEST,
        payload: friendship
    }
}

const setFriends = (friends) => {
    return {
        type: GET_ALL_FRIENDS,
        payload: friends
    }
}

export const updateFriendship = (friendshipId) => async (dispatch) => {
    const res = await csrfFetch(`/api/friends/${friendshipId}`, {
        method: 'PUT'
    })
    const data = await res.json()

    if (data && !data.message) dispatch(setUpdateFriend(data))
    return data
}

export const requestFriend = (friendId) => async (dispatch) => {
    const res = await csrfFetch(`/api/friends/${friendId}`, {
        method: 'POST'
    })
    const data = await res.json()

    if (data) dispatch(setNewFriend(data))
    return data
}

export const getUsers = () => async (dispatch) => {
    const res = await csrfFetch('/api/users')
    const data = await res.json()
    if (data && !data.message) {
        console.log(data)
        dispatch(setUsers(flatten(data)))
    }
}

export const getFriends = () => async (dispatch) => {
    const res = await csrfFetch(`/api/friends`).catch((e) => {console.log(e)})
    if (res) {
        const data = await res.json()
        if (data && !data.message) dispatch(setFriends(data))
        return data

    }
}

const initialState = {allFriends: {}}

export const friendsReducer = (state = initialState, action) => {
    const currentState = { ...state }
    const currentFriends = { ...currentState.allFriends }
    const currentUsers = {...state.users}
    switch (action.type) {
        case GET_ALL_FRIENDS:
            return { ...state, allFriends: { ...flatten(action.payload) } }
        case GET_ALL_USERS:
            return {...state, users: action.payload}
        case ADD_FRIEND_REQUEST:
            const friendId = action.payload.toUserId
            const user = currentUsers[friendId]
            currentUsers[friendId] = {...user, Friendship: {...action.payload}}
            return {...state, users: {...currentUsers}}
        case UPDATE_FRIEND_REQUEST:
            const fromUserId = action.payload.fromUserId
            const fromUser = {...currentUsers[fromUserId]}
            currentUsers[fromUserId] = {...fromUser, Friendship: {...action.payload}}
            return {...state, users: {...currentUsers}}
        default:
            return state
    }
}
