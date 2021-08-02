const Router = require('express')
const router = Router()
const brandController = require('../controllers/brandController')

const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.get('/', brandController.getAll)
router.post('/',checkRoleMiddleware('ADMIN'), brandController.create)
router.delete('/', brandController.delete)
module.exports = router