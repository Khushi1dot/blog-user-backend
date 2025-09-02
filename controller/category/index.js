const router = require("express").Router();
const CategoryController = require("./category.controller");

router.post("/", CategoryController.create);
router.get("/", CategoryController.getAll);

module.exports = router;
