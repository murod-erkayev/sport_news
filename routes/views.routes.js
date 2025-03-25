const { addView, getAllViews, getViewById, deleteView, updateView } = require("../controllers/views.controller");


const router = require("express").Router();


router.post('/', addView)
router.get('/', getAllViews)
router.post('/:id', getViewById)
router.post('/:id',deleteView )
router.post('/:id', updateView)


module.exports = router