const sequelize = require('../db')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING}
})