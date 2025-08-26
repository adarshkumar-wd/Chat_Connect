import { log } from "console";
import mongoose from "mongoose";

export const dbConnection = async () => {

    try {
        
        const connection = await mongoose.connect(process.env.MONGODB_URI)

        if (!connection) {
            throw new Error("Databasse connection failed!!")
        }
        log("Database connectes successfully..")

    } catch (error) {
        console.log(error)
    }

}