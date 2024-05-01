const express = require('express');
const router = express.Router();
const twitterController = require("../controllers/twitter");


router.get('/get-twitter-request-token', twitterController.authenticateUser)

module.exports = router