const express = require('express');
const router = express.Router();
const { getLetter } = require('../controllers/letterController');

router.get('/', getLetter);

module.exports = router;
