const express = require('express');
const {
  getBookmarks,
  toggleBookmark,
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All bookmark routes require authentication

router.get('/', getBookmarks);
router.post('/:questionId', toggleBookmark);

module.exports = router;
