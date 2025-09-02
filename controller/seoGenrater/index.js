const express = require("express");
const router = express.Router();
const catchAsync = require('../../utils/catch');
const SeoController = require("./seo.controller");

router.post('/seo-suggestions', catchAsync(SeoController.generateSEOSuggestions));
router.post('/generate-blog', catchAsync(SeoController.generateBlog));

module.exports = router;
