import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    parentId: {
        type: String
    }
})

const User = mongoose.model('user', UserSchema);
export default User;
// module.exports = User;