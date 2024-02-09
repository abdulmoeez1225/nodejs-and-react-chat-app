
const mongoose = require('mongoose');


const ChatRoomSchema = new Schema({
  name: String,
  type: { type: String, enum: ['public', 'private'], default: 'public' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;