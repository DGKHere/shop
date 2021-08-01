const uuid = require('uuid')
const path = require('path')

const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/apiError')


class DeviceController {

    async create(req, res, next) {

        try {

            let {name, price, count, brandId, typeId, info} = req.body
            const {img} = req.files

            let fileName = uuid.v4() + '.jpg'
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const device = await Device.create({name, price, count, brandId, typeId, img: fileName})

            if (info) {
                info = JSON.parse(info)
                info = info.map(({title, description}) => {
                    return {title, description, deviceId: device.id}
                })

                await DeviceInfo.bulkCreate(info)

            }

            return res.json(device)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {

        let {brandId, typeId, limit, page} = req.query

        page = page || 1
        limit = limit || 9

        const offset = (page - 1) * limit

        const where = {}

        if (brandId) where.brandId = brandId
        if (typeId) where.typeId = typeId

        const devices = await Device.findAndCountAll({where, limit, offset})

        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            });

        return res.json(device)
    }

}

module.exports = new DeviceController()