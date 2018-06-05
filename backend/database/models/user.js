module.exports = function(sequelize, dataTypes) {
    const user = sequelize.define('user', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: dataTypes.ENUM('ADMIN', 'EMPLOYEE'),
            defaultValue: 'EMPLOYEE'
        },
        first_name: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        last_name: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        username: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        refresh_token: {
            type: dataTypes.TEXT
        },
    }, {
        freezeTableName: true,
        underscored: true,
        tableName: 'users',
        indexes: [{
            fields: ['username'],
            unique: true
        }]
    })

    return user
}
