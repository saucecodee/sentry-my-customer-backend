const express = require('express');
const router = express.Router();
const emailController = require("../controllers/emailController");
const auth = require('../auth/auth');

router.post('/reminder/email/:customer_id', auth, emailController.sendMail);
router.post('/reminder/sms/:customer_id', auth, emailController.sendSMS);

module.exports = router
