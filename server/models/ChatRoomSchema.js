const { default: mongoose } = require("mongoose");



const chatRoomSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['public', 'private'], default: 'public' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });