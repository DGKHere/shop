const User = require('./User'),
    Device = require('./Device'),
    Brand = require('./Brand'),
    Type = require('./Type'),
    DeviceInfo = require('./DeviceInfo'),
    TypeBrand = require('./TypeBrand'),
    Order = require('./Order'),
    OrderDevice = require('./OrderDevice')

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(DeviceInfo, {as: 'info'})
DeviceInfo.belongsTo(Device)

User.hasMany(Order)
Order.belongsTo(User)

Order.belongsToMany(Device, {through: OrderDevice})
Device.belongsToMany(Order, {through: OrderDevice})

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})


module.exports = {
    User,
    Device,
    Brand,
    Type,
    DeviceInfo,
    TypeBrand,
    Order,
    OrderDevice
}