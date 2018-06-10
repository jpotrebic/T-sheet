// src/js/store/index.js
import { createStore, applyMiddleware } from 'redux'
import axiosMiddleware from 'redux-axios-middleware'
import reducers from '../reducers'
import api from '../components/api'

const store = createStore(
    reducers,
    applyMiddleware(
        axiosMiddleware(api)
    )
)

export default store
