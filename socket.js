import { userModel } from "./models/user.model.js";
import { conversationModel } from "./models/conversation.model.js";
import { createConversation } from "./utils/saveConversation.js";
import mongoose from "mongoose";

export const socketInisializer = (io) => {
    let userSocketMap = {}

    io.on("connection", (socket) => {
        // console.log('A user connected' , socket.id);

        socket.on("register", async (userId) => {

            if (!userId) return;

            try {
                userSocketMap[socket.id] = userId;
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                // console.log("socketId Updated");
                io.emit("updation", socket.id, userId);
                // user[socket.id] = userId
                // console.log('userId : ' , user[socket.id]);

            } catch (error) {
                console.log(error)
            }
        })


        socket.on("message", async ({ receiverS, message, receiver, sender }) => {
            // console.log(`message : ${message} , to receiver : ${receiver} , rs : ${receiverS}  ,  send by ${sender}`)
            const newConversation = await createConversation(message, receiver, sender);
            io.to(receiverS).emit("receivedMessage", newConversation);
            socket.emit("updataionOnSender", newConversation);
        })

        socket.on("user:online", async (data) => {
            const { id } = data;
            const idObj = new mongoose.Types.ObjectId(id)

            const updateStatus = await userModel.findOneAndUpdate(idObj, { status: "online" }, { new: true });

            if (updateStatus) {
                io.emit("user:online")
            }

        })

        socket.on("send:request", async (data) => {
            const user = await userModel.findByIdAndUpdate(
                data._id,
                {
                    $push: {
                        friendRequests: data
                    }
                },
                { new: true }
            )

            if (user) {
                console.log("user : " , user)
                socket.emit("request:sent")
            }
        })

        socket.on("disconnect", async () => {
            const userId = userSocketMap[socket.id];
            console.log("userId : ", userId)
            if (userId) {
                await userModel.findByIdAndUpdate(userId, {
                    status: "offline",
                    socketId: null
                });

                delete userSocketMap[socket.id]; // cleanup
                io.emit("user:online", { id: userId, status: "offline" });
            }
        });


    });
}