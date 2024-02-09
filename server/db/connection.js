const mongoose = require('mongoose');

const url = `mongodb+srv://abdulmoeez1225:12345@cluster0.gvjkua7.mongodb.net/ChatApp?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB')).catch((e)=> console.log('Error', e))