import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import DatePicker from 'material-ui/DatePicker'
import {grey400} from 'material-ui/styles/colors'
import Divider from 'material-ui/Divider'
import PageBase from '../components/PageBase'
import axios from 'axios'

let projects = [{id: 1, name: 'free time'}]
const form = {
    username: localStorage.getItem('username'),
    project: 1,
    tasks: 'Coding',
    duration: '8',
    date: Date.now()
}

// helper functions
const fetchProjects = () => {
    axios({
        method: 'get',
        url: 'http://127.0.0.1:1080/api/project',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
    })
        .then((response) => {
            projects = response.data.data
        })
}

const logWork = () => {
    axios({
        method: 'post',
        url: 'http://127.0.0.1:1080/api/entry',
        data: form,
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
    })
        .then(() => {
            alert('Work logged')
        })
        .catch((error) => {
            alert(error)
        })
}

const handleChange = (field, value) => {
    form[field] = value
}

const FormPage = () => {
    fetchProjects()

    const styles = {
        toggleDiv: {
            maxWidth: 300,
            marginTop: 40,
            marginBottom: 5
        },
        toggleLabel: {
            color: grey400,
            fontWeight: 100
        },
        buttons: {
            marginTop: 30,
            float: 'right'
        },
        logWorkButton: {
            marginLeft: 5
        }
    }

    return (
        <PageBase title="Work Entry Page"
            navigation="Application / Work Entry Page">
            <form>

                <TextField
                    hintText="Username"
                    floatingLabelText="Username"
                    value={form.username}
                    fullWidth={true}
                    onChange={(event, value) => handleChange('username', value)}
                />

                <SelectField
                    floatingLabelText="Project"
                    fullWidth={true}
                    onChange={(event, key, value) => handleChange('project', value)}>

                    {projects.map(x => <MenuItem key ={x.id} value={x.name} primaryText={x.name} />)}
                </SelectField>

                <TextField
                    hintText="Tasks"
                    floatingLabelText="Tasks"
                    fullWidth={true}
                    value={form.tasks}
                    onChange={(event, value) => handleChange('tasks', value)}
                />

                <TextField
                    hintText="Duration"
                    floatingLabelText="Duration"
                    fullWidth={true}
                    value={form.duration}
                    onChange={(event, value) => handleChange('duration', value)}
                />

                <DatePicker
                    hintText="Date"
                    floatingLabelText="Date"
                    fullWidth={true}
                    onChange={(event, value) => handleChange('date', value)}
                />

                <Divider/>

                <div style={styles.buttons}>
                    <RaisedButton label="Log Work"
                        style={styles.logWorkButton}
                        type="submit"
                        primary={true}
                        onClick={logWork}/>
                </div>
            </form>
        </PageBase>
    )
}

export default FormPage
