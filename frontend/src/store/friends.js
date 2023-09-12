import { csrfFetch } from './csrf'

export const flatten = (arr) => {
console.log(arr)
    const obj = {}
    for (let el of arr) {
        if (el.results) {
            console.log(el.results)
            el.data = JSON.parse(el.results)
        }
        obj[el.id] = el
    }
    return obj
}

const GET_ALL_FRIENDS = 'getFriends/all'

const setFriends = (friends) => {
    return {
        type: GET_ALL_FRIENDS,
        payload: friends
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
    switch (action.type) {
        case GET_ALL_FRIENDS:
            return { ...state, allFriends: { ...flatten(action.payload) } }
        default:
            return state
    }
}
