const sequelize = require('../db')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('order_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.STRING, require: true}
},{
    timestamps: false
})
