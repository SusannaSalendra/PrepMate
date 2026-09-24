const mongoose = require('mongoose');
const MockSession = require('../models/MockSession');
const Question = require('../models/Question');
const Category = require('../models/Category');

// @desc    Start a new Mock Interview Session
// @route   POST /api/mock-sessions/start
// @access  Private
const startSession = async (req, res, next) => {
  try {
    const { category, difficulty = 'Any', count = 5 } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a category for the mock interview',
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Selected category does not exist',
      });
    }

    // Build query criteria
    const matchCriteria = { category: new mongoose.Types.ObjectId(category) };
    if (difficulty && difficulty !== 'Any') {
      matchCriteria.difficulty = difficulty;
    }

    const questionCountToFetch = Math.max(1, Math.min(parseInt(count, 10) || 5, 20));

    // Sample random questions
    let sampleQuestions = await Question.aggregate([
      { $match: matchCriteria },
      { $sample: { size: questionCountToFetch } },
    ]);

    // If not enough questions with specific difficulty, fallback to any difficulty in same category
    if (sampleQuestions.length === 0) {
      sampleQuestions = await Question.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(category) } },
        { $sample: { size: questionCountToFetch } },
      ]);
    }

    if (sampleQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions available in this category yet. Please try another category or add questions.',
      });
    }

    const sessionQuestions = sampleQuestions.map((q) => ({
      question: q._id,
      answerText: '',
      confidenceRating: 3,
      status: 'Pending',
    }));

    const mockSession = await MockSession.create({
      user: req.user._id,
      category,
      difficulty,
      questions: sessionQuestions,
      startedAt: new Date(),
    });

    const populatedSession = await MockSession.findById(mockSession._id)
      .populate('category', 'name description')
      .populate('questions.question');

    res.status(201).json({
      success: true,
      data: populatedSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer for a question in active session
// @route   PUT /api/mock-sessions/:id/answer
// @access  Private
const submitAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionId, answerText, confidenceRating, status } = req.body;

    const session = await MockSession.findOne({ _id: id, user: req.user._id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock session not found',
      });
    }

    const questionItem = session.questions.find(
      (item) => item.question.toString() === questionId
    );

    if (!questionItem) {
      return res.status(404).json({
        success: false,
        message: 'Question not part of this mock session',
      });
    }

    if (answerText !== undefined) questionItem.answerText = answerText;
    if (confidenceRating !== undefined) questionItem.confidenceRating = confidenceRating;
    if (status !== undefined) questionItem.status = status;

    await session.save();

    const updatedSession = await MockSession.findById(session._id)
      .populate('category', 'name description')
      .populate('questions.question');

    res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a mock interview session
// @route   PUT /api/mock-sessions/:id/complete
// @access  Private
const completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { timeTakenSeconds } = req.body;

    const session = await MockSession.findOne({ _id: id, user: req.user._id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock session not found',
      });
    }

    session.isCompleted = true;
    session.completedAt = new Date();
    if (timeTakenSeconds !== undefined) {
      session.timeTakenSeconds = Math.max(0, parseInt(timeTakenSeconds, 10) || 0);
    }

    await session.save();

    const populatedSession = await MockSession.findById(session._id)
      .populate('category', 'name description')
      .populate('questions.question');

    res.status(200).json({
      success: true,
      data: populatedSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's mock session history
// @route   GET /api/mock-sessions/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const sessions = await MockSession.find({ user: req.user._id })
      .populate('category', 'name description')
      .populate('questions.question')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mock session by ID
// @route   GET /api/mock-sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const session = await MockSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('category', 'name description')
      .populate('questions.question');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  submitAnswer,
  completeSession,
  getHistory,
  getSessionById,
};
