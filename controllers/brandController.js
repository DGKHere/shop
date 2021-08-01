const {Brand} = require('../models/models')
const ApiError = require('../error/apiError')

class BrandController {

    async create(req, res){
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res){
        const types = await Brand.findAll()
        return res.json(types)
    }

}

module.exports = new BrandController()