const express = require('express');
const router = express.Router();
const { verifyPasscode, getUsers } = require('../controllers/userController');
const validatePasscode = require('../middleware/validatePasscode');

router.get('/', getUsers);
router.post('/verify', validatePasscode, verifyPasscode);

module.exports = router;
