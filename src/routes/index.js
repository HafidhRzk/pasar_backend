const express = require("express");
const router = express.Router();

const auth = require("./auth")
const role = require("./role")
const access_list = require("./access_list")

router.use('/auth', auth);
router.use('/role', role);
router.use('/access_list', access_list);


module.exports = router;