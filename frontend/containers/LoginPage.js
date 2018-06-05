import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import {grey500, white} from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField'
import {browserHistory} from 'react-router'
import ThemeDefault from '../theme-default'
import api from '../components/api'

const input = {
    username: null,
    password: null
}

const handleChange = (field, value) => { input[field] = value }

// login
const loginClick = () => {
    api.post('login', {
        username: input.username,
        password: input.password
    })
        .then((response) => {
            localStorage.setItem('access_token', response.data.data.access_token)
            localStorage.setItem('role', response.data.data.role)
            localStorage.setItem('username', input.username)
            browserHistory.push('/')
        })
        .catch((error) => {
            localStorage.setItem('access_token', null)
            localStorage.setItem('role', null)
            localStorage.setItem('username', null)
            alert(error)
        })
}

const LoginPage = () => {
    const styles = {
        loginContainer: {
            minWidth: 320,
            maxWidth: 400,
            height: 'auto',
            position: 'absolute',
            top: '20%',
            left: 0,
            right: 0,
            margin: 'auto'
        },
        paper: {
            padding: 20,
            overflow: 'auto'
        },
        buttonsDiv: {
            textAlign: 'center',
            padding: 10
        },
        flatButton: {
            color: grey500
        },
        checkRemember: {
            style: {
                float: 'left',
                maxWidth: 180,
                paddingTop: 5
            },
            labelStyle: {
                color: grey500
            },
            iconStyle: {
                color: grey500,
                borderColor: grey500,
                fill: grey500
            }
        },
        loginBtn: {
            float: 'right'
        },
        btn: {
            background: '#4f81e9',
            color: white,
            padding: 7,
            borderRadius: 2,
            margin: 2,
            fontSize: 13
        },
        btnFacebook: {
            background: '#4f81e9'
        },
        btnGoogle: {
            background: '#e14441'
        },
        btnSpan: {
            marginLeft: 5
        },
    }

    return (
        <MuiThemeProvider muiTheme={ThemeDefault}>
            <div>
                <div style={styles.loginContainer}>
                    <Paper style={styles.paper}>
                        <form>
                            <TextField
                                hintText="Username"
                                floatingLabelText="Username"
                                fullWidth={true}
                                onChange={(event, value) => handleChange('username', value)}
                            />
                            <TextField
                                hintText="Password"
                                floatingLabelText="Password"
                                fullWidth={true}
                                type="password"
                                onChange={(event, value) => handleChange('password', value)}
                            />
                            <div>
                                <RaisedButton label="Login"
                                    primary={true}
                                    style={styles.loginBtn}
                                    onClick={loginClick}/>
                            </div>
                        </form>
                    </Paper>
                </div>
            </div>
        </MuiThemeProvider>
    )
}

export default LoginPage
