// const io = require('socket.io')(8000,{cors:{origin:"*"}});
const soc = require('socket.io');
const express=require('express')
const mongoose = require('mongoose');
const User=require('./usermodel')
const path=require('path')
const bodyParser = require('body-parser');
const app=express();
const hostname='0.0.0.0'
const server = app.listen(process.env.PORT || 3000,hostname, () => {
    console.log("listening on port :3000");
});
const io = soc(server);
require('dotenv').config()
const PORT=process.env.PORT
app.use(express.static(path.join(__dirname,"..", 'frontend')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://aarushkaura09062004:NiVEqvOiGuBRnz6n@cluster1.qe2fn90.mongodb.net/Projects");
        console.log("Connected to Mongo DB");
        counter=0
    } catch (error) {
        console.log(error.message);
    }
}
connectDB()

// app.listen(PORT,()=>{
//     console.log("listening on port 3000")
// })



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../login.html'));
  });
  app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,'../signup.html'))
})
app.post('/signup',async (req,res)=>{
    try{
    const {fname,lname,email,password}=req.body

    const newUser=new User({firstname:fname,lastname:lname,email:email,password:password})
     await newUser.save()
     res.status(201).sendFile(path.join(__dirname,'../login.html'))

    }
    catch(error){
        console.log('error connecting ti mongodb',error)
    }
})

let em=""
app.post('/loggedin',async (req,res)=>{
    try {
        const check = await User.findOne({ email: req.body.email })
        if (check.password === req.body.password) {
            em=check.email
            res.status(201).sendFile(path.join(__dirname,'../index.html'))
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {
        console.log(e)
        res.send("wrong details")
        

    }

})
app.get('/frontend/ting.mp3',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','frontend','ting.mp3'))
})
app.get('/frontend/logo.png',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','frontend','logo.png'))
})
app.get('/js/client.js', (req, res) => {
   
    res.sendFile(path.join(__dirname, '..', 'js', 'client.js'));
});

app.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'css', 'style.css'));
});
app.get('/api/names', async (req, res) => {
    try {
        const check = await User.findOne({ email: em })
        res.json(check);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });
    
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
});
