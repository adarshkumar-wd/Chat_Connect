import { conversationModel } from "../models/conversation.model.js";

export const createConversation = async (message , receiver , sender) => {

    try {
        const newConversation = await conversationModel.create({
            message : message,
            receiver : receiver,
            sender : sender
        })
    
        if (!newConversation) {
            throw new Error("conversation not created...")
        }
    
        return newConversation
    } catch (error) {
        console.log(error)
    }

}