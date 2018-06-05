import React, {PropTypes} from 'react'
import {browserHistory} from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/svg-icons/navigation/menu'
import {white} from 'material-ui/styles/colors'

class Header extends React.Component {
    signOut() {
        localStorage.setItem('access_token', null)
        localStorage.setItem('role', null)
        localStorage.setItem('username', null)
        browserHistory.push('/login')
    }

    render() {
        const {styles, handleChangeRequestNavDrawer} = this.props

        const style = {
            appBar: {
                position: 'fixed',
                top: 0,
                overflow: 'hidden',
                maxHeight: 57
            },
            menuButton: {
                marginLeft: 10
            },
            iconsRightContainer: {
                marginLeft: 20
            }
        }

        return (
            <div>
                <AppBar
                    title={<span style={styles.title}>T-sheet</span>}
                    style={{...styles, ...style.appBar}}
                    iconElementLeft={
                        <IconButton style={style.menuButton} onClick={handleChangeRequestNavDrawer}>
                            <Menu color={white} />
                        </IconButton>
                    }
                    iconElementRight={
                        <FlatButton label="Sign out" onClick={this.signOut} />
                    }
                />
            </div>
        )
    }
}

Header.propTypes = {
    styles: PropTypes.object,
    handleChangeRequestNavDrawer: PropTypes.func
}

export default Header
