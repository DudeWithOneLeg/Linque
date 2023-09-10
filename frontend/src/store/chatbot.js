import { useDeferredValue } from 'react'
import { csrfFetch } from './csrf'



export const flatten = (arr) => {
    const obj = {}
    for (let el of arr) {
        if (el.data) el.data = JSON.parse(el.data)
      obj[el.id] = el
    }
    return obj
}

const GET_ALL_CONVOS = 'getConvos/all'
const DELETE_CONVO = 'deleteConvo/one'
const GET_SINGLE_CONVO = 'getConvo/one'
const CREATE_MESSAGE = 'create/message'
const CLEAR_MESSAGES = 'clear/messages'

const removeMessages = () => {
    return {
        type: CLEAR_MESSAGES
    }
}

const setAllConvos = (convos) => {
    return {
        type: GET_ALL_CONVOS,
        payload: convos
    }
}

const setOneConvo = (convo) => {
    return {
        type: GET_SINGLE_CONVO,
        payload: convo
    }
}


const setDeleteConvo = (convoId) => {
    return {
        type: DELETE_CONVO,
        payload: convoId
    }
}

const setNewMessage = (message) => {
    return {
        type: CREATE_MESSAGE,
        payload: message
    }
}

export const clearMessages = () => async (dispatch) => {
    return dispatch(removeMessages())
}

export const getAllConvos = () => async (dispatch) => {
    const res = await csrfFetch('/api/chatbot')
    const data = await res.json()
    if (data && !data.message) dispatch(setAllConvos(flatten(data)))

    return flatten(data)
}

export const getOneConvo = (convoId) => async (dispatch) => {
    const res = await csrfFetch(`/api/chatbot/${convoId}`)
    const data = await res.json()
    if (data && !data.message) dispatch(setOneConvo(flatten(data)))

    return res
}

export const deleteConvo = (convoId) => async (dispatch) => {
    const res = await csrfFetch(`/api/chatbot/${convoId}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    if (data && data.message) dispatch(setDeleteConvo(convoId))

    return res
}

export const createMessage = (message) => async (dispatch) => {



        const res = await csrfFetch(`/api/chatbot/`, {
            method: 'POST',
            body: JSON.stringify(message)
        })
        const data = await res.json()
        if (data && !data.message) dispatch(setNewMessage(data))

        message.chatBotConvoId = data.chatBotConvoId
        message.language = data.language
        const gpt = await csrfFetch(`/api/chatbot/gpt`, {
            method: 'POST',
            body: JSON.stringify(message)
        })
        const gptData = await gpt.json()
        if (gptData && !gptData.message) dispatch(setNewMessage(gptData))
        return res


}

const initialState = {}

export const ChatBotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_CONVOS:
            return {...state, allConvos: {...action.payload}}
        case GET_SINGLE_CONVO:
            return {...state, singleConvo: {...action.payload}}
        case DELETE_CONVO:
            const deleteId = action.payload
            const currentState = {...state}
            const currentConvos = {...currentState.allConvos}
            delete currentConvos[deleteId]
            return {...state, allConvos: {...currentConvos}}
        case CREATE_MESSAGE:
            let object = action.payload
            console.log(object)
            const id = object.id
            const newState = {...state}
            const newConvo = {...newState.singleConvo}
            newConvo[id] = {...object}

            return {...newState, singleConvo: {...newConvo}}
        case CLEAR_MESSAGES:
            return {...state, singleConvo: null}
        default:
            return state
    }
}
