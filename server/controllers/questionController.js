const jwt = require('jsonwebtoken');
const Question = require('../models/Question');
const Category = require('../models/Category');
const Bookmark = require('../models/Bookmark');

// Helper to check user ID from request without failing if not logged in
const getUserIdFromOptionalAuth = (req) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'prepmate_secret_key');
      return decoded.id;
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  return null;
};

// @desc    Get all questions with filters, search, and pagination
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res, next) => {
  try {
    const {
      search,
      category,
      difficulty,
      company,
      tag,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== 'all') {
      // Check if it's an ObjectId or category name
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (catDoc) {
          query.category = catDoc._id;
        }
      }
    }

    // Filter by Difficulty
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // Filter by Company
    if (company && company.trim()) {
      query.company = { $regex: company.trim(), $options: 'i' };
    }

    // Filter by Tag
    if (tag && tag.trim()) {
      query.tags = { $in: [new RegExp(tag.trim(), 'i')] };
    }

    // Keyword Search across title, description, tags, and company
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { company: regex },
        { tags: { $in: [regex] } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .populate('category', 'name description')
      .populate('createdBy', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Check bookmarks for logged-in user if available
    const userId = getUserIdFromOptionalAuth(req);
    let bookmarkedQuestionIds = new Set();
    if (userId) {
      const bookmarks = await Bookmark.find({ user: userId }).select('question');
      bookmarkedQuestionIds = new Set(bookmarks.map((b) => b.question.toString()));
    }

    const questionsWithBookmarkStatus = questions.map((q) => ({
      ...q.toObject(),
      isBookmarked: bookmarkedQuestionIds.has(q._id.toString()),
    }));

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: questionsWithBookmarkStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email role');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const userId = getUserIdFromOptionalAuth(req);
    let isBookmarked = false;
    if (userId) {
      const bookmark = await Bookmark.findOne({
        user: userId,
        question: question._id,
      });
      isBookmarked = !!bookmark;
    }

    res.status(200).json({
      success: true,
      data: {
        ...question.toObject(),
        isBookmarked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, company, tags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question title, description, and category',
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist',
      });
    }

    // Normalize tags
    let formattedTags = [];
    if (Array.isArray(tags)) {
      formattedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      formattedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const question = await Question.create({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty: difficulty || 'Medium',
      company: company ? company.trim() : '',
      tags: formattedTags,
      createdBy: req.user._id,
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, company, tags } = req.body;

    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist',
        });
      }
      question.category = category;
    }

    if (title) question.title = title.trim();
    if (description) question.description = description.trim();
    if (difficulty) question.difficulty = difficulty;
    if (company !== undefined) question.company = company.trim();

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        question.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        question.tags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      data: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Also remove any bookmarks referencing this question
    await Bookmark.deleteMany({ question: question._id });
    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
