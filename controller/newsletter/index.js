const express = require('express');
const router = express.Router();
const NewsletterController = require('./newsletter.controller');

router.post('/subscribe', NewsletterController.subscribeNewsletter);

module.exports = router;
