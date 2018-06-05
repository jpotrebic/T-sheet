'use strict'

/**
 * @param {string} query - request querystring
 * @returns {object} - object containing limit, offset, sort, search and filter
 */
module.exports = async function (query) {
    const options = {}
    if (!query)
        return options

    // jquery anti cache requests
    if (query['_'])
        delete query['_']

    // LIMIT
    const limit = parseInt(query.limit)
    if (!isNaN(limit) && limit > 0)
        options.limit = limit
    delete query.limit

    // OFFSET
    const offset = parseInt(query.offset)
    if (!isNaN(offset) && offset > 0)
        options.offset = offset
    delete query.offset

    // SORT
    const sort = query.sort
    if (sort !== undefined && sort.length) {
        options.sort = []
        const columns = sort.split(',')
        for (let i = 0, length = columns.length; i < length; i++) {
            let column = columns[i]
            // descending should have "-" in column name
            if (column.indexOf('-') > -1) {
                column = column.replace('-', '')
                options.sort.push([column, 'DESC'])
            } else
                options.sort.push([column, 'ASC'])
        }
    }
    delete query.sort

    // SEARCH
    const search = query.search
    if (search)
        options.search = search
    delete query.search

    // FILTER
    options.filter = {}
    for (let i = 0, col = Object.keys(query), len = col.length; i < len; i++) {
        const column = col[i]
        let value = query[column]

        // multiple possible filter options, e.g. channel_id=1,2,3
        if (value.indexOf(',') !== -1)
            value = value.split(',')

        options.filter[column] = value
    }

    // return object containing all query parameters
    return options
}
