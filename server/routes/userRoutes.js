const express = require('express');
const {
  getProfile,
  updateProfile,
  getAllUsers,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route('/')
  .get(protect, isAdmin, getAllUsers);

module.exports = router;
