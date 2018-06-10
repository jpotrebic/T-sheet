const initialState = {
    authorization: {
        token: null,
        role: null,
        username: null
    }
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
    case 'SIGN_OUT':
        state.authorization = Object.assign({}, state.authorization, {
            token: null,
            role: null,
            username: null
        })
        return state
    case 'FETCH_AUTH_USER_SUCCESS':
        state.authorization = Object.assign({}, state.authorization, {
            token: action.payload.data.data.access_token,
            role: action.payload.data.data.role,
            username: action.meta.previousAction.payload.request.data.username
        })
        return state
    case 'FETCH_AUTH_USER_FAIL':
        state.authorization = Object.assign({}, state.authorization, {
            token: null,
            role: null,
            username: null
        })
        return state
    default:
        return state
    }
}

export default reducers
