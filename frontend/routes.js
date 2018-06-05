import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'
import App from './containers/App'
import Dashboard from './containers/DashboardPage'
import LoginPage from './containers/LoginPage'
import NotFoundPage from './containers/NotFoundPage.js'
import WorkEntryPage from './containers/WorkEntryPage'

function requireAuth() {
    const auth = localStorage.getItem('access_token')
    if (!auth)
        browserHistory.push('/login')
}

export default (
    <Route>
        <Route path="login" component={LoginPage}/>
        <Route path="/" component={App} onEnter={requireAuth}>
            <IndexRoute component={Dashboard} onEnter={requireAuth}/>
            <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>
            <Route path="worklog" component={WorkEntryPage} onEnter={requireAuth}/>
            <Route path="*" component={NotFoundPage} onEnter={requireAuth}/>
        </Route>
    </Route>
)
