import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js";
import http from "http"
import { dbConnection } from "./db/dbConnection.js";
import { Server } from "socket.io";
import { socketInisializer } from "./socket.js";

const server = http.createServer(app)
const port = process.env.PORT || 5000

export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
})

socketInisializer(io)

// console.log(" usersId : " , user)
app.get("/", (req,res)=>{
    res.send("Hello From Server");
})


dbConnection()
    .then(() => {

        server.listen(port, (_, res) => {
            console.log(`Server is running on port ${port}`)
        })

    }).catch((error) => {
        console.log(error.message)
    })
