const {User, Device, Order, OrderDevice} = require("../models/models")
const ApiError = require("../error/apiError")
const {Op} = require('sequelize');
const sequelize = require('../db')

class BasketController{

    async showOrder(req, res){

        const session = req.session;

        if(!Array.isArray(session.basket) || !session.basket.length){
            return res.json({})
        }

        const arrId = session.basket.map(prod =>{
            return prod.id
        })

        const products = await Device.findAll({where: {id: {[Op.in]: arrId}}})

        res.json({mes: products})
    }

    async basketAdd(req, res){

        const {id} = req.body

        if (!id) return res.json("Товар не выбран")

        const countProd = await Device.count({where: {id}})

        if (!countProd) return res.json("Товар не существует")

        const session = req.session;

        if (!session.basket || !Array.isArray(session.basket)){
            session.basket = []
        }

        const product = session.basket.find(product => product.id === id)

        if (product){
            product.count++
        }else{
            session.basket.push({id, count: 1})
        }

        session.save();

        res.json({session})
    }

    basketRemove(req, res){

        const {id} = req.body

        if (!id){
            res.json("Товар не выбран")
        }

        const session = req.session;

        if (!session.basket || !Array.isArray(session.basket) || !session.basket.length){
            res.json("Корзина пуста")
        }

        const product = session.basket.find(product => product.id === id)

        if (!product){
            res.json("Товар отсутствует в корзине")
        }

        if (product.count === 1){
            session.basket = session.basket.filter(p => p !== product)
        }else {
            product.count--
        }

        session.save()
        console.log(session)

        res.json({session})
    }

    async basketConfirm(req, res){



        const name = 'Dmitry'
        const address = 'Taganrog'
        const phone = '89682633380'

        const basket = [
            {id: 1, count: 2},
            {id: 2, count: 1},
            {id: 4, count: 4},
        ]


        // const basket = req.session.basket;
        //
        // if (!Array.isArray(basket) || !basket.length){
        //     return res.json({message: "Корзина пуста"})
        // }
        //
        // const {name, address, phone} = req.body
        //
        // if (!name || !address || !phone){
        //     res.json(ApiError.badRequest("Данные введены неверно"))
        // }

        try {

            await sequelize.transaction(async (t) => {

                const arrId = basket.map(({id}) => {return id})
                const products = await Device.findAll({attributes: ['id', 'count'], where: {id: {[Op.in]: arrId}}})

                products.forEach(product => {

                    const i = arrId.indexOf(product.id)

                    if (i === -1) return res.json({message: `Товар ${id} не найден`})
                    if (!product.count >= basket[i].count) return res.json({message: `В настоящий момент ${product.name} доступен только в колличестве ${product.count}`})

                    product.count -= basket[i].count
                    product.save({transaction: t})
                })

                const order = await Order.create({name, address, phone},{transaction: t})

                const insertRows = basket.map(({id, count}) => {
                    return {orderId: order.id, deviceId: id, count}
                })

                order.order_device = await OrderDevice.bulkCreate(insertRows,{transaction: t})
            })

        }catch (e){
            return ApiError.badRequest('При оформленни заказа произошла ошибка')
        }

        // basket.length = 0
        // req.session.save()

        res.json({message: 'Заказ успешно оформлен'})
    }

}

module.exports = new BasketController()