const SPEECH_INPUT = 'speech/input'

export const setSpeech = (speech) => {
    return {
        type: SPEECH_INPUT,
        payload: speech
    }
}

const initialState = {}

export const speechReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SPEECH_INPUT:
            newState = {...state, speech: action.payload}
            return newState
        default:
            return state
    }
}
