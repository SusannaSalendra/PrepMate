const express = require('express');
const {
  chatWithMentor,
  evaluateCandidateResponse,
  getQuestionHint,
  getMentorPersonas,
} = require('../controllers/aiMentorController');

const router = express.Router();

router.get('/personas', getMentorPersonas);
router.post('/chat', chatWithMentor);
router.post('/evaluate', evaluateCandidateResponse);
router.post('/hint', getQuestionHint);

module.exports = router;
