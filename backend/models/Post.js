// models/Post.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true, maxlength: 1000 },
  anonymous: { type: Boolean, default: false },
  reactions: {
    heart: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    thumbsUp: { type: Number, default: 0 },
    pray: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: {
    type: String,
    enum: ['pcos', 'pregnancy', 'hormone_balance', 'general', 'thyroid', 'endometriosis', 'mental_health'],
    required: true,
  },
  title: { type: String, maxlength: 200 },
  content: { type: String, required: true, maxlength: 5000 },
  anonymous: { type: Boolean, default: false },
  tags: [String],
  reactions: {
    heart: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    thumbsUp: { type: Number, default: 0 },
  },
  comments: [commentSchema],
  commentCount: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isExpertAnswer: { type: Boolean, default: false },
}, {
  timestamps: true,
});

postSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
