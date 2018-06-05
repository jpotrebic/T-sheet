'use strict'

const container = require('../../lib/container')
const crypto = require('crypto')
const moment = require('moment')
const random = require('../../lib/utils').getRandom

/**
 * @function populate
 * @return {undefined}
 */
module.exports.populate = async function(type) {
    if (type !== 'demo')
        return

    const models = container.get('models')

    // insert fake users
    const users = [{
        type: 'ADMIN',
        first_name: 'Ron',
        last_name: 'Swanson',
        username: 'rswanson',
        password: 'ron123'
    },{
        type: 'ADMIN',
        first_name: 'Leslie',
        last_name: 'Knope',
        username: 'lknope',
        password: 'leslie123'
    },{
        first_name: 'April',
        last_name: 'Ludgate',
        username: 'aludgate',
        password: 'april123'
    },{
        first_name: 'Tom',
        last_name: 'Haverford',
        username: 'thaverford',
        password: 'tom123'
    },{
        first_name: 'Donna',
        last_name: 'Meagle',
        username: 'dmeagle',
        password: 'donna123'
    },{
        first_name: 'Jerry',
        last_name: 'Gergich',
        username: 'lgergich',
        password: 'garry123'
    }]

    // hash passwords
    for (let i = 0, len = users.length; i < len; i++) {
        let password = users[i].password
        password = crypto.createHash('md5').update(password).digest('hex')
        users[i].password = password
    }


    await models['user'].bulkCreate(users)

    // insert fake projects
    const projects = [{
        name: 'Free time',
        client: 'Parks Department'
    },{
        name: 'The pit',
        client: 'Ann Perkins'
    },{
        name: 'Budget deficit',
        client: 'Ben Wyatt'
    },{
        name: 'Harvest Festival',
        client: 'Pawnee'
    }]

    await models['project'].bulkCreate(projects)

    // insert fake work entries for the last 30 days
    const work = []
    const tasks = ['planing', 'organizing', 'writing', 'reading', 'campaigning']
    const free = ['lunch', 'doctor', 'slacking']
    for (let i = 0; i < 29; i++) {
        const date = moment().subtract(30-i, 'days')
        for (let u = 0, len = users.length; u < len; u++) {
            let hours = 8.00

            const free_time = u === 1 ? 0 : random.integer(0,1) // leslie has no free time
            if (free_time) {
                const spent = random.decimal(0, hours)
                const action = random.integer(0,2)
                work.push({
                    user_id: u+1,
                    project_id: 1,
                    tasks: free[action],
                    duration: spent,
                    date
                })

                hours = hours - spent
            }

            const no_tasks = random.integer(1,3)
            for (let t = 0; t < no_tasks; t++) {
                const spent = random.decimal(0, hours)
                const action = random.integer(0,4)
                work.push({
                    user_id: u+1,
                    project_id: t+2,
                    tasks: tasks[action],
                    duration: spent,
                    date
                })

                hours = hours - spent
            }
        }
    }

    await models['entry'].bulkCreate(work)

    return
}
