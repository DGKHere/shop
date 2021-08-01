const {Device, Order} = require("../models/models")
const ApiError = require("../error/apiError")
const sequelize = require('../db')

class BasketController{

    async showOrder(req, res){

        const basket = req.session.basket;

        if(!Array.isArray(basket) || !basket.length){
            return res.json({message: 'Корзина пуста'})
        }

        const arrId = basket.map(prod =>{
            return prod.id
        })

        const products = await Device.findAll({where: {id: {[Op.in]: arrId}}})

        res.json({mes: products})
    }

    async basketAdd(req, res, next){

        const {id} = req.body

        if (!id) return next(ApiError.badRequest("Товар не выбран"))

        const countProd = await Device.count({where: {id}})

        if (!countProd) return next(ApiError.badRequest("Товар не существует"))

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

    basketRemove(req, res, next){

        const {id} = req.body

        if (!id) return next(ApiError.badRequest('Товар не выбран'))

        const session = req.session;

        if (!Array.isArray(session.basket) || !session.basket.length){
            res.json({message: 'Корзина пуста'})
        }

        const product = session.basket.find(product => product.id === id)

        if (!product){res.json({message: 'Товар отсутствует в корзине'})}

        if (product.count === 1){
            session.basket = session.basket.filter(p => p !== product)
        }else {
            product.count--
        }
        session.save()

        res.json({session})
    }

    async basketConfirm(req, res, next){



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
        //     return next(ApiError.badRequest("Данные введены неверно"))
        // }

        try {
            await Order.createOrder(name, address, phone, basket)
        }catch (e){
            return next(ApiError.badRequest(e.message))
        }

        basket.length = 0
        req.session.save()

        res.json({message: 'Заказ успешно оформлен'})
    }

}

module.exports = new BasketController()