const express = require('express');
const router = express.Router();
const twitterController = require("../controllers/twitter");

router.get('/twitter-success/:code', twitterController.authenticateUser)
router.get('/get-twitter-user/:token', twitterController.getUser)


module.exports = router