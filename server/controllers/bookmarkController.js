const Bookmark = require('../models/Bookmark');
const Question = require('../models/Question');

// @desc    Get all bookmarks for current user
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'question',
        populate: [
          { path: 'category', select: 'name description' },
          { path: 'createdBy', select: 'name email role' },
        ],
      })
      .sort({ createdAt: -1 });

    // Filter out any bookmarks whose referenced question was deleted
    const validBookmarks = bookmarks.filter((b) => b.question !== null);

    const formattedData = validBookmarks.map((b) => ({
      _id: b._id,
      createdAt: b.createdAt,
      question: {
        ...b.question.toObject(),
        isBookmarked: true,
      },
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark for a question (add/remove)
// @route   POST /api/bookmarks/:questionId
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      question: questionId,
    });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      return res.status(200).json({
        success: true,
        isBookmarked: false,
        message: 'Question removed from bookmarks',
      });
    }

    const newBookmark = await Bookmark.create({
      user: req.user._id,
      question: questionId,
    });

    res.status(201).json({
      success: true,
      isBookmarked: true,
      message: 'Question bookmarked successfully',
      data: newBookmark,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookmarks,
  toggleBookmark,
};
