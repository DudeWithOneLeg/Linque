import { csrfFetch } from './csrf'

export const flatten = (arr) => {
    console.log(arr)
        const obj = {}
        for (let el of arr) {

            obj[el.id] = el
        }
        return obj
    }

    const GET_ALL_MESSAGES = 'messages/all'
    const ADD_MESSAGE = 'message/add'

    export const setMessage = (message) => {
        return {
            type: ADD_MESSAGE,
            payload: message
        }
    }

    const setMessages = (messages) => {
        return {
            type: GET_ALL_MESSAGES,
            payload: messages
        }
    }

    export const getMessages = (convoId) => async (dispatch) => {
        const res = await csrfFetch(`/api/conversations/${convoId}`).catch((e) => {console.log(e)})
        if (res) {
            const data = await res.json()
            if (data && !data.message) dispatch(setMessages(data))
            return data

        }
    }

    const initialState = {allFriends: {}}

    export const messageReducer = (state = initialState, action) => {

        switch (action.type) {
            case GET_ALL_MESSAGES:
                return { ...state, allMessages: { ...flatten(action.payload) } }
            case ADD_MESSAGE:
                const messages = {...state.allMessages}
                const lastMessageId = Object.values(messages)[Object.values(messages).length - 1].id
                messages[lastMessageId + 1] = {...action.payload, id: lastMessageId + 1}
                return {...state, allMessages: messages}
            default:
                return state
        }
    }
