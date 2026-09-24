const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a question title'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide the answer/description for this question'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate a category with this question'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      required: [true, 'Please specify difficulty level'],
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for keyword text searches and fast filtering
questionSchema.index({ title: 'text', description: 'text', tags: 'text', company: 'text' });
questionSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
