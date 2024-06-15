import mongoose from 'mongoose';
const { Schema } = mongoose;

const StaticIdSchema = new Schema({
    parentId: {
        type: String
    }
})

const StaticId = mongoose.model('static_id', StaticIdSchema);
export default StaticId;
// module.exports = User;