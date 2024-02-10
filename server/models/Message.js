const mongoose = require('mongoose');



const RoomMessageSchema = new mongoose.Schema({
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: {type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });



const RoomMessage = mongoose.model('RoomMessage', RoomMessageSchema);

module.exports = RoomMessage;