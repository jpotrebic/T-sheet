module.exports = function(sequelize, dataTypes) {
    const project = sequelize.define('project', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        client: {
            type: dataTypes.TEXT,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        underscored: true,
        tableName: 'projects',
        indexes: [{
            fields: ['name', 'client'],
            unique: true
        }]
    })

    return project
}
