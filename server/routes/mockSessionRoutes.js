const express = require('express');
const {
  startSession,
  submitAnswer,
  completeSession,
  getHistory,
  getSessionById,
} = require('../controllers/mockSessionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All mock session routes require authentication

router.post('/start', startSession);
router.get('/history', getHistory);
router.get('/:id', getSessionById);
router.put('/:id/answer', submitAnswer);
router.put('/:id/complete', completeSession);

module.exports = router;
