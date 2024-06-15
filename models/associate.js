import mongoose from 'mongoose';
const { Schema } = mongoose;

const AssociateSchema = new Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    phoneNumber:{
        type: String
    },
    parentId:{
        type: String
    }
})

const Associate = mongoose.model('associate', AssociateSchema);
export default Associate;
// module.exports = User;