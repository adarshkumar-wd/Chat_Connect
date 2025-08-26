import { conversationModel } from "../models/conversation.model.js";
import { deletedMessageModdel } from "../models/deletedMessages.model.js";

export const getMessages = async (req , res) => {

    const {receiver , sender} = req.params

    // console.log(`receiver : ${receiver} , sender : ${sender}`)

    if (!receiver || !sender) {
        return res.status(404).json({success : false , messages , message : "Please provide sender and receiver id's.."})
    }

    const messages = await conversationModel.find({
        $or : [
            {sender : sender , receiver : receiver},
            {sender : receiver , receiver : sender}
        ]
    })

    const deletedMessage = await deletedMessageModdel.find({
        $or : [
            {sender : sender , receiver : receiver},
            {sender : receiver , receiver : sender}
        ]
    })

    const deletedMessgageSet = new Set(deletedMessage.map((msg) => {if (msg.deletedBy.toString() === sender) return msg.messageId.toString()}));

    const filteredMessages = messages.filter((msg) => !deletedMessgageSet.has(msg._id.toString()))

    return res.status(200).json({success : true , messages : filteredMessages , message : "Message successfully fetched.."})

}