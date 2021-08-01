const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){

    try{
        const headerAuthorization = req.headers.authorization

        if (headerAuthorization){

            const token = req.headers.authorization.split(' ')[1]

            if(token){
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                req.user = decoded
            }

        }

        next()

    }catch (e){
        return res.status(404).json({message: e.message})
    }

}