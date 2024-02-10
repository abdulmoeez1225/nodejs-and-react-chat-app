const mongoose = require('mongoose');

const privateMessageSchema = mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'PrivateConversation' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = PrivateMessage;