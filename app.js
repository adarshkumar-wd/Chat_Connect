import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(cookieParser())
app.use(express.urlencoded())
app.use(express.json())

// ROUTES INITIALIZE..

import userRouter from "./routes/user.route.js";
import conversationRoute from "./routes/conversation.route.js";
import deleteMessageRouter from './routes/deletedMessage.route.js'

app.use("/users" , userRouter)
app.use("/messages" , conversationRoute)
app.use("/delete" , deleteMessageRouter)


export {app}