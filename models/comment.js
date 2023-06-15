const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }
  });

const commentItemSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },  
});

// const commentItemSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   type: {type: String, required: true, enum: ['activity', 'comment', 'approval'] },
//   createdAt: { type: Date, default: Date.now },
//   uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true },
//   referlink: [{
//     type: {type: String, enum: ['File-link, messagID']},
//     value: { type: String, required: true }
//   }]
// });

const commentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  comments: [commentItemSchema],
  tags: [tagSchema]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;