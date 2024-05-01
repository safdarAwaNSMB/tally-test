const express = require('express');
const router = express.Router();
const adminController = require("../controllers/admin");

router.post('/create-admin', adminController.createAdmin);
router.post('/login-admin', adminController.adminLogin);
router.post('/change-password', adminController.changePassword);
router.get('/get-user', adminController.getUser)

module.exports = router