import React from 'react'
import {cyan600, orange600} from 'material-ui/styles/colors'
import Assessment from 'material-ui/svg-icons/action/assessment'
import Face from 'material-ui/svg-icons/action/face'
import InfoBox from '../components/dashboard/InfoBox'
import NewOrders from '../components/dashboard/NewOrders'
import MonthlySales from '../components/dashboard/MonthlySales'
import globalStyles from '../styles'
import Data from '../data'
import api from '../components/api'
import store from '../store/index'

const status = {
    projects: 0,
    employees: 0
}

const fetchProjects = () => {
    api.get('project', {
        headers: {
            authorization: 'Bearer ' + store.getState().authorization.token
        }
    })
        .then((response) => {
            status.projects = response.data.data.length
        })
}

const fetchEmployees = () => {
    api.get('user', {
        headers: {
            authorization: 'Bearer ' + store.getState().authorization.token
        }
    })
        .then((response) => {
            status.employees = response.data.data.length
        })
}

const DashboardPage = () => {
    fetchProjects()
    fetchEmployees()

    return (
        <div>
            <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                    <InfoBox Icon={Face}
                        color={orange600}
                        title="Employees"
                        value={status.employees}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                    <InfoBox Icon={Assessment}
                        color={cyan600}
                        title="Projects"
                        value={status.projects}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
                    <NewOrders data={Data.dashBoardPage.newOrders}/>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15">
                    <MonthlySales data={Data.dashBoardPage.monthlySales}/>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
