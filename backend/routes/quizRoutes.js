const router = require('express').Router();
const quizController = require('../controllers/quizController');


router.post('/generate', quizController.generateQuestion);
router.post('/submit',  quizController.submitAnswer);


module.exports = router;