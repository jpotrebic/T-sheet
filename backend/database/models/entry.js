module.exports = function(sequelize, dataTypes) {
    const entry = sequelize.define('entry', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            onDelete: 'CASCADE'
        },
        project_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            onDelete: 'CASCADE'
        },
        tasks: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        duration: {
            type: dataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        date: {
            type: dataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        underscored: true,
        tableName: 'entries',
        indexes: [{
            fields: ['user_id', 'project_id', 'date'],
            unique: true
        }],
        hooks:
        {
            beforeCreate: setDate
        }
    })

    entry.associate = function(models) {
        entry.belongsTo(models.user,
            {
                foreignKey: 'user_id'
            })
        entry.belongsTo(models.project,
            {
                foreignKey: 'project_id'
            })
    }

    /**
     * @function setDate
     * @param {object} instance database instance
     */
    function setDate(instance) {
        if (!instance.date)
            instance.date = new Date()
    }

    return entry
}
