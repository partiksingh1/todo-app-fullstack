import mongoose from 'mongoose';
const  {Schema} = mongoose;

const todoSchema = new Schema({
    user: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true 
          },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:String
    },
    date: {
        type:Date,
        default:Date.now()
    },
    completed: {
        type:Boolean,
        default:false
    }
})
export const Todo = mongoose.model("Todo", todoSchema);
