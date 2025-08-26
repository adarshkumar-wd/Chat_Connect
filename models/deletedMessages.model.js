import mongoose from 'mongoose'

const deletedMessageSchema = new mongoose.Schema({

    messageId : {
        type : mongoose.Types.ObjectId,
        ref : "Conversation",
        required : true,
    },

    sender : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },

    receiver : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },

    deletedBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    }

});

export const deletedMessageModdel = mongoose.model("deletedMessage" , deletedMessageSchema)