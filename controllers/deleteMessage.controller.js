import mongoose from "mongoose";
import { deletedMessageModdel } from "../models/deletedMessages.model.js";
import { conversationModel } from "../models/conversation.model.js";
import { io } from "../server.js";

export const createmessage = async (req , res) => {

    const {messageId , senderId , receiverId , deletedBy} = req.params;

    if (!messageId || !senderId || !receiverId) {
        return res.status(400).json({success : false , message : "Please provide all datas..."});
    }

    const existMessageId = await deletedMessageModdel.findOne({messageId : messageId , deletedBy : deletedBy});

    if (existMessageId) {
        return res.status(400).json({success : false , message : "Message already deleted..."});
    }

    const deletedMessage = await deletedMessageModdel.create({
        messageId : messageId,
        sender : senderId,
        receiver : receiverId,
        deletedBy : deletedBy
    })

    if (!deletedMessage) {
        return res.status(500).json({success : false , message : "Server error while deleting messages..."});
    }

   return res.status(200).json({success : true ,  deletedMessage , message : "Message deleted successfully..."});

}

export const getMessages = async (req , res) => {

    const {firstuser , seconduser} = req.params

    if (!firstuser , !seconduser) {
        return res.status(400).json({success : false , message : "User id's are required..."});
    }

    const getMessages = await deletedMessageModdel.find({
        $or : [
            {sender : firstuser , receiver : seconduser}, 
            {sender : seconduser , receiver : firstuser}
        ]
    })

    return res.status(200).json({success : true , messages : getMessages , message : "Messages fetched successfully..."});

}

export const deleteMessageFromDatabase = async (req , res) => {
    try {

        const {messageId} = req.params;

        if (!messageId || !mongoose.isValidObjectId) {
            return res.status(400).json({success : false , message : "Please Provide the valide message Id.."});
        }

        const deleteMessage = await conversationModel.findByIdAndDelete(messageId);
        
        if (!deleteMessage) {
            return res.status(400).json({success : false , message : "Message not found in the Database"});
        }

        const deleteMessagefromDeletedMessageModel = await deletedMessageModdel.findOneAndDelete({messageId : messageId});

        io.emit("messageDeleted");

        return res.status(200).json({success : true , message : "Message Deleted Succesfully"});

    } catch (error) {
        console.log("delete message error : " , error);
    }
}