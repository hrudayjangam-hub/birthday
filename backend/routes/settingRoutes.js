const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/settingController');

router.get('/:key', getSetting);
router.put('/:key', updateSetting);

module.exports = router;
