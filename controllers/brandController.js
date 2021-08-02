const {Brand, Device} = require('../models/models')
const ApiError = require('../error/apiError')

class BrandController {

    async create(req, res){
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res){
        const brand = await Brand.findAll()
        return res.json(brand)
    }

    async delete(req, res, next) {


        const {id} = req.body

        if (!id) return next(ApiError.badRequest('Брэнд не выбран'))

        if (!await Brand.destroy({where: {id}}) && await Device.update({id: null}, {where: {id}})){
            return res.json({message:'Брэнд успешно удален'})
        }
        else return res.json({message:'При удалении произошла ошибка'})

    }


}

module.exports = new BrandController()