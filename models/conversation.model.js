import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    message : {
        type : String,
        required : true
    },

    sender : {
        type : String,
        required : true
    },

    receiver : {
        type : String,
        required : true
    },

} , {timestamps : true})

export const conversationModel = mongoose.model("Conversation" , conversationSchema)