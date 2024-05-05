const mongoose=require('mongoose')
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    
}, { collection: 'user' });
const LoginD=new mongoose.model('LoginD',UserSchema)

module.exports=LoginD