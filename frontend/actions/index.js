export const signOut = (authorization) => {
    return {
        type: 'SIGN_OUT',
        payload: authorization
    }
}

export const fetchAuthUser = (credentials) => {
    return {
        type: 'FETCH_AUTH_USER',
        payload: {
            request: {
                url: 'login',
                method: 'post',
                data: {
                    username: credentials.username,
                    password: credentials.password
                }
            }
        }
    }
}
