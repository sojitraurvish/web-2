import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
    },
    password: { 
        type: String, 
        required: true
    },
   firstName:{
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
   },
   lastName:{
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
   }
});

const User = mongoose.model("User", userSchema);

export default User;