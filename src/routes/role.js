const express = require('express');
const router = express.Router();

const { getForSelectOpt, getAll, createRole, updateRole, getById, deleteById } = require('../controllers/role');
const { auth } = require('../middlewares/auth');

router.get('/getSelectOpt', auth, getForSelectOpt);
router.get('/', auth, getAll);
router.post('/', auth, createRole);
router.patch('/:id', auth, updateRole);
router.get('/:id', auth, getById);
router.delete('/:id', auth, deleteById);

module.exports = router;
