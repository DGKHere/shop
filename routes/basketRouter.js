const Router = require('express')
const router = Router()
const BasketController = require('../controllers/basketController')

router.get('/', BasketController.showOrder)
router.post('/add', BasketController.basketAdd)
router.post('/remove', BasketController.basketRemove)
router.post('/confirm', BasketController.basketConfirm)


module.exports = router