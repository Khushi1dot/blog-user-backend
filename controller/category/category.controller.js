const Category = require("../../models/category.schema");
const catchAsync = require("../../utils/catch");

class CategoryController {
  static create = catchAsync(async (req, res) => {
    const newCat = new Category(req.body);
    const savedCat = await newCat.save();
    res.status(200).json({ success: true, data: savedCat });
  });

  static getAll = catchAsync(async (req, res) => {
    const cats = await Category.find();
    res.status(200).json({ success: true, data: cats });
  });
}

module.exports = CategoryController;
