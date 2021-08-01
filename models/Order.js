const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const ApiError = require('../error/apiError')
const Device = require('./Device')
const OrderDevice = require('./OrderDevice')
const {Op} = require('sequelize');

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING}
})

Order.createOrder = async function (name, address, phone, basket){


    await sequelize.transaction(async (t) => {

        const arrId = basket.map(({id}) => {return id})

        const products = await Device.findAll({attributes: ['id', 'count'], where: {id: {[Op.in]: arrId}}})

        products.forEach(product => {

            const i = arrId.indexOf(product.id)

            if (i === -1) throw new Error(`Товар ${product.name} не найден`)
            if (!product.count >= basket[i].count) throw new Error(`В настоящий момент ${product.name} доступен только в колличестве ${product.count}`)

            product.count -= basket[i].count
            product.save({transaction: t})
        })

        const order = await Order.create({name, address, phone},{transaction: t})

        const insertRows = basket.map(({id, count}) => {
            return {orderId: order.id, deviceId: id, count}
        })

        order.order_device = await OrderDevice.bulkCreate(insertRows,{transaction: t})
    })

}

module.exports = Order