const express = require('express');
const router = express.Router();

const { getByRoleId, updateAccess, getAllMenu } = require('../controllers/access_list');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getByRoleId);
router.get('/allMenu', auth, getAllMenu);
router.post('/', auth, updateAccess);

module.exports = router;
