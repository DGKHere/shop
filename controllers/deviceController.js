const uuid = require('uuid')
const path = require('path')

const {Device, DeviceInfo} = require('../models/models')
const {Op} = require('sequelize');
const ApiError = require('../error/apiError')
const fs = require('fs')


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

    async update(req, res, next){


        try {

            let {id, name, price, count, brandId, typeId, info} = req.body

            const {img} = req.files

            let device = await Device.findOne(
                {
                    where: {id},
                    include: [{model: DeviceInfo, as: 'info'}]
                })

            if (img){

                if (device.img){
                    fs.unlink(path.resolve(__dirname, '..', 'static', device.img), (err) => {
                        console.log('Deleted');
                    });
                }

                let fileName = uuid.v4() + '.jpg'
                await img.mv(path.resolve(__dirname, '..', 'static', fileName))
            }

            for (let key in device){
                if (req.body.hasOwnProperty(key)){

                    if (key == 'img') continue

                    if (key === 'info'){
                        device[key] = JSON.parse(req.body[key])
                        continue
                    }

                    device[key] = req.body[key]
                }
            }

            device = await device.save()


            return res.json(device)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }


    }

}

module.exports = new DeviceController()