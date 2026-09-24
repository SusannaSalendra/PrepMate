const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, isAdmin, createCategory);

router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, isAdmin, updateCategory)
  .delete(protect, isAdmin, deleteCategory);

module.exports = router;
