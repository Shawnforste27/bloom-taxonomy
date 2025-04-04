const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/generate', questionController.generateQuestionPaper);

module.exports = router;