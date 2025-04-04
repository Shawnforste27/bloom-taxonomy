const express = require('express');
const { searchQuestion } = require('../controllers/searchController');

const router = express.Router();

router.post('/question', searchQuestion);

module.exports = router;