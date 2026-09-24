const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const MockSession = require('../models/MockSession');
const Question = require('../models/Question');
const Category = require('../models/Category');

// @desc    Get user profile with aggregated statistics
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Aggregate statistics for dashboard
    const bookmarksCount = await Bookmark.countDocuments({ user: req.user._id });
    const totalSessions = await MockSession.countDocuments({ user: req.user._id });
    const completedSessions = await MockSession.find({
      user: req.user._id,
      isCompleted: true,
    }).populate('category', 'name');

    // Count answered questions and average confidence
    let totalQuestionsAttempted = 0;
    let confidenceSum = 0;
    let answeredCount = 0;
    const categoryStatsMap = {};

    completedSessions.forEach((session) => {
      const catName = session.category ? session.category.name : 'General';
      if (!categoryStatsMap[catName]) {
        categoryStatsMap[catName] = {
          categoryName: catName,
          attempted: 0,
          totalConfidence: 0,
          sessionsCount: 0,
        };
      }
      categoryStatsMap[catName].sessionsCount += 1;

      session.questions.forEach((q) => {
        if (q.status === 'Answered') {
          totalQuestionsAttempted += 1;
          answeredCount += 1;
          confidenceSum += q.confidenceRating || 3;

          categoryStatsMap[catName].attempted += 1;
          categoryStatsMap[catName].totalConfidence += q.confidenceRating || 3;
        }
      });
    });

    const averageConfidence =
      answeredCount > 0 ? (confidenceSum / answeredCount).toFixed(1) : 0;

    const categoryProgress = Object.values(categoryStatsMap).map((item) => ({
      name: item.categoryName,
      attempted: item.attempted,
      avgConfidence: item.attempted > 0 ? (item.totalConfidence / item.attempted).toFixed(1) : 0,
      sessions: item.sessionsCount,
    }));

    const totalSystemQuestions = await Question.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          bookmarksCount,
          totalSessions,
          completedSessionsCount: completedSessions.length,
          totalQuestionsAttempted,
          averageConfidence: Number(averageConfidence),
          totalSystemQuestions,
          totalCategories,
          categoryProgress,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email, password)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, email, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another account',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    // If updating password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current password to set a new password',
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
};
