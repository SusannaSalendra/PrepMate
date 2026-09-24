const mongoose = require('mongoose');

const mockSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Any', 'Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        answerText: {
          type: String,
          default: '',
        },
        confidenceRating: {
          type: Number,
          min: 1,
          max: 5,
          default: 3,
        },
        status: {
          type: String,
          enum: ['Pending', 'Answered', 'Skipped'],
          default: 'Pending',
        },
      },
    ],
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MockSession', mockSessionSchema);
