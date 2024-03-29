const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8080', "https://main-tick-healthy.ngrok-free.app"],
    }
});

// Connect DB
require('./db/connection');

// Import Files
const Users = require('./models/Users');
const PrivateConversation = require('./models/PrivateConversation');
const PrivateMessage = require('./models/PrivateMessage');
const ChatRoom = require('./models/ChatRoom');
const RoomMessage = require('./models/Message');

// app Use
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
const port = process.env.PORT || 8000;
const ADMIN = "Admin"

// Socket.io
let users = [];
io.on('connection', socket => {
    console.log('User connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
        } else {
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
        }
    });

    socket.on('sendMessageRoomServer', async ({
        senderId,
        chatRoomId,
        message,
        roomName }) => {
        try {
            const sender = users.find(user => user.userId === senderId);
            const user = await Users.findById(senderId);
            console.log('sender :>> ', sender);

            const chatRoom = await ChatRoom.findById(chatRoomId);

            if (!chatRoom) {
                console.error('Chat room not found');
                return;
            }
            console.log("here")

            const newMessage = new RoomMessage({
                chatRoomId,
                senderId: senderId,
                message
            });
            await newMessage.save();


            io.to(roomName).emit("toRoomMessage", {
                user: { id: user._id, fullName: user.fullName, email: user.email },
                message,

            });


            console.log('Message added to chat room successfully');
        } catch (error) {
            console.error('Error adding message to chat room:', error.message);
        }
    });

    socket.on('createChatRoom', async (chatRoomData) => {
        try {
            console.log(chatRoomData)
            const newChatRoom = new ChatRoom(chatRoomData);
            newChatRoom.members.push(chatRoomData?.member)
            const savedChatRoom = await newChatRoom.save();
            socket.emit('chatRoomCreated', savedChatRoom);
        } catch (error) {
            console.error(error.message);
        }
    });

    // Get all chat rooms
    socket.on('getChatRooms', async (user_id) => {
        try {
            const chatRooms = await ChatRoom.find({});
            socket.emit('chatRooms', chatRooms);
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('getAllRoomConversationServer', async (roomName) => {
        try {
            const chatRooms = await ChatRoom.findOne({ name: roomName });
            const roomConversation = await RoomMessage.find({ chatRoomId: chatRooms._id })
                .populate('chatRoomId')
                .populate('senderId')
                .populate({
                    path: 'chatRoomId',
                    populate: {
                        path: 'members'
                    }
                }).sort('-createdAt').limit(10)
            roomConversation.reverse()
            socket.emit('getAllRoomConversationClient', roomConversation);
        } catch (error) {
            console.error(error.message);
        }

    })

    socket.on('joinRoom', async (payload) => {
        try {
            const chatRooms = await ChatRoom.findOne({ name: payload.roomName, members: payload.userId });

            if (chatRooms == null) {
                const findRoom = await ChatRoom.findOne({ name: payload.roomName })
                findRoom.members.push(payload.userId)
                await findRoom.save()
            }
            const userIndex = users.map(user => user.userId).indexOf(payload.userId)
            users[userIndex].room = payload.roomName
            socket.join(payload.roomName)
            // io.to(payload.roomName).emit('toRoomMessage', buildMsg(payload.userName, `has left the room`))

        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('getAlljoinedRoomServer', async (userId) => {
        try {
            const chatRooms = await ChatRoom.find({ members: userId });
            socket.emit("getAlljoinedRoomClient", chatRooms)
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('getAllRoomMembersServer', async (roomName) => {
        try {
            const AllRoomMembers = await ChatRoom.findOne({ name: roomName }).populate('members', '_id fullName email')
            socket.emit('getAllRoomMembersClient', AllRoomMembers)
        } catch (error) {
            console.error(error.message);
        }
    })

    socket.on('activity', (name) => {
        const user = users.find(user => user.socketId == socket.id)
        if (user) {
            socket.broadcast.to(user.room).emit('activity', name)
        }
    })

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
});

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

// Routes
app.get('/', (req, res) => {
    res.send('Welcome');
})

app.post('/api/register', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            res.status(400).send('Please fill all required fields');
        } else {
            const isAlreadyExist = await Users.findOne({ email });
            if (isAlreadyExist) {
                res.status(400).send('User already exists');
            } else {
                const newUser = new Users({ fullName, email });
                bcryptjs.hash(password, 10, (err, hashedPassword) => {
                    newUser.set('password', hashedPassword);
                    newUser.save();
                    next();
                })
                return res.status(200).json({ message: 'User registered successfully' });
            }
        }

    } catch (error) {
        console.log(error, 'Error')
    }
})

app.post('/api/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send('Please fill all required fields');
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send('User email or password is incorrect');
            } else {
                const validateUser = await bcryptjs.compare(password, user.password);
                if (!validateUser) {
                    res.status(400).send('User email or password is incorrect');
                } else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        return res.status(200).json({ message: "You Login Successfully", user: { id: user._id, email: user.email, fullName: user.fullName }, token: token })
                    })
                }
            }
        }

    } catch (error) {
        console.log(error, 'Error')
    }
})

app.post('/api/conversation', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newCoversation = new PrivateConversation({ members: [senderId, receiverId] });
        await newCoversation.save();
        res.status(200).send('Conversation created successfully');
    } catch (error) {
        console.log(error, 'Error')
    }
})

app.get('/api/conversations/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await PrivateConversation.find({ members: { $in: [userId] } });
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.log(error, 'Error')
    }
})

app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send('Please fill all required fields')
        if (conversationId === 'new' && receiverId) {
            const newCoversation = new PrivateConversation({ members: [senderId, receiverId] });
            await newCoversation.save();
            const newMessage = new PrivateMessage({ conversationId: newCoversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).send('Message sent successfully');
        } else if (!conversationId && !receiverId) {
            return res.status(400).send('Please fill all required fields')
        }
        const newMessage = new PrivateMessage({ conversationId, senderId, message });
        await newMessage.save();
        res.status(200).send('Message sent successfully');
    } catch (error) {
        console.log(error, 'Error')
    }
})

app.get('/api/message/:conversationId', async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            console.log(conversationId, 'conversationId')
            const messages = await PrivateMessage.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            }));
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await PrivateConversation.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id);
            } else {
                return res.status(200).json([])
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.log('Error', error)
    }
})

app.get('/api/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });
        const usersData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } }
        }))
        res.status(200).json(await usersData);
    } catch (error) {
        console.log('Error', error)
    }
})

app.listen(port, () => {
    console.log('listening on port ' + port);
})

