const mongoose = require('mongoose');
const Chat = require('./models/chat');
main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/whatsapp');
}

Chat.insertMany([
    { from: 'Alice', to: 'Bob', message: 'Hello Bob!', createdAt: new Date() },
    { from: 'Bob', to: 'Alice', message: 'Hi Alice!', createdAt: new Date() },
    { from: 'Alice', to: 'Bob', message: 'How are you?', createdAt: new Date() },
])