import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)