const SPEECH_INPUT = 'speech/input'
const CLEAR_SPEECH = 'speech/clear'

export const setSpeech = (speech) => {
    return {
        type: SPEECH_INPUT,
        payload: speech
    }
}

export const clearSpeech = () => {
    return {
        type: CLEAR_SPEECH
    }
}

const initialState = {}

export const speechReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SPEECH_INPUT:
            newState = {...state, speech: action.payload}
            return newState
        case CLEAR_SPEECH:
            return {...state, speech: null}
        default:
            return state
    }
}
