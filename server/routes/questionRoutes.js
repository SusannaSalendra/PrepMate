const express = require('express');
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getQuestions)
  .post(protect, isAdmin, createQuestion);

router
  .route('/:id')
  .get(getQuestionById)
  .put(protect, isAdmin, updateQuestion)
  .delete(protect, isAdmin, deleteQuestion);

module.exports = router;
