const initialState = {
    authorization: {
        token: null,
        role: null,
        username: null
    }
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'ADD_AUTHORIZATION':
        state.authorization = Object.assign({}, state.authorization, action.payload)
        return state
    default:
        return state
    }
}

export default rootReducer
