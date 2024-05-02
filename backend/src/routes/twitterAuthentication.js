const express = require('express');
const router = express.Router();
const twitterController = require("../controllers/twitter");

router.get('/twitter-success/:code', twitterController.authenticateUser)
router.get('/get-twitter-user/:token', twitterController.getUser)
router.get('/get-like-result/:token/:userId/:tweetId', twitterController.checkLike)
router.get('/get-follow-result/:token/:userId/:userName', twitterController.checkFollow)


module.exports = router