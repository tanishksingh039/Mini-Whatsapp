const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const Chat=require('./models/chat');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("views",path.join(__dirname,'views'));
app.set("view engine","ejs");

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/whatsapp');
}


app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/chats', async (req, res) => {
    try {
        let chats = await Chat.find({});
        res.render("index.ejs",{chats}) // Send the actual chat data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch chats" });
    }
});
//post request to create a new chat
app.post('/chats', async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const newChat = new Chat({ from, to, message });
        await newChat.save();
        res.redirect('/chats');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create chat" });
    }
});

// Add this new route before app.listen()
app.post('/chats/delete', async (req, res) => {
    try {
        const { message, createdAt } = req.body;
        const result = await Chat.findOneAndDelete({ 
            message: message,
            createdAt: {
                $gte: new Date(new Date(createdAt).setHours(0, 0, 0)),
                $lt: new Date(new Date(createdAt).setHours(23, 59, 59))
            }
        });

        if (!result) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.redirect('/chats');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete chat" });
    }
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})