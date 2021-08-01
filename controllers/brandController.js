const {Brand} = require('../models/models')
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

        const isDelete = await Brand.destroy({where: {id}})

        if (isDelete) return res.json({message:'Брэнд успешно удален'})
    }


}

module.exports = new BrandController()