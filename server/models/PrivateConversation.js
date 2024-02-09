const mongoose = require('mongoose');

const PrivateConversationSchema = mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PrivateConversation = mongoose.model('PrivateConversation', PrivateConversationSchema);

module.exports = PrivateConversation;