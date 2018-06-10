/* eslint-disable import/default */

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import routes from './routes'
import store from './store'
import injectTapEventPlugin from 'react-tap-event-plugin'
require('./favicon.ico')
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'

injectTapEventPlugin()

render(
    <Provider store={store}>
        <Router routes={routes} history={browserHistory} />
    </Provider>
    , document.getElementById('app')
)
