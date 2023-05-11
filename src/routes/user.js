const express = require('express');
const router = express.Router();

const { 
    addUser,
    getUsers,
    updateUser,
    deleteUser
} = require('../controllers/user')
const { auth } = require('../middlewares/auth');

router.post('/', addUser);
router.get('/', getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
