const {Type} = require('../models/models')
const ApiError = require('../error/apiError')

class TypeController {

    async create(req, res){
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete(req, res, next) {

        const {id} = req.body
        if (!id) return next(ApiError.badRequest('Тип не выбран'))

        const isDelete = await Type.destroy({where: {id}})

        if (isDelete) return res.json({message:'Тип успешно удален'})
    }

}

module.exports = new TypeController()