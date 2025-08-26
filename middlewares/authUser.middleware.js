import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js"

export const authUser = async (req , _ , next) => {

    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    // console.log("token : " , token)

    if (!token) {
        console.log("token " , token);
    }

    const decodeToken = jwt.verify(token , process.env.TOKEN_SECRET);

    if (!decodeToken) {
        throw new Error("Invalid Token");
    }

    const user = await userModel.findById(decodeToken._id).select("-password");

    if (!user) {
        throw new Error("Invalid token! Unauthorised acces");
    }

    if (token !== user.token) {
        throw new Error("Incorrect token...")
    }

    req.user = user;
    next();

}