import { userModel } from "../models/user.model.js"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // console.log(`name : ${name} , email : ${email} , password : ${password}`);


        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required.." });
        }

        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.status(400).json({ success: false, message: "Email already exist.." });
        }

        const avatarLocalPath = req.file?.path


        if (!avatarLocalPath) {
            return res.status(400).json({ success: false, message: "Avatar is mandatory.." });
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        // console.log("avatar : " , avatar)

        if (!avatar) {
            return res.status(500).json({ success: false, message: "Something went wrong while uploading the avatar.." });
        }

        const createUser = await userModel.create(
            {
                name: name,
                email: email,
                password: password,
                avatar : avatar.url
            }
        )

        if (!createUser) {
            return res.status(500).json({ success: false, message: "Server error! user not created.." });
        }
        // console.log('createUser : ' , createUser);

        const userData = await userModel.findOne({ _id: createUser._id }).select("-password")

        const token = userData.generateTokens()

        if (!token) {
            return res.status(500).json({ success: false, message: "Server error! token not generated.." });
        }

        userData.token = token
        userData.save({ validateBeforeSave: false })

        const options = {
            httpOnly: true,
            secure: false
        }

        return res.status(200).cookie("token", token, options).json({ success: true, user: userData, message: "user register successfull.." });

    } catch (error) {
        return res.status(400).json({ success: false, message:  error.message || "Server error! User not registered.." });
    }
}

export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required.." });
        }
    
        const findUser = await userModel.findOne({ email });
    
        if (!findUser) {
            return res.status(404).json({ success: false, message: "User not found.." });
        }
    
        const isPasswordCorrect = findUser.checkPassword(password)
    
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect password.." });
        }
    
        const userData = await userModel.findById(findUser._id).select("-password");
    
        if (!userData) {
            return res.status(500).json({ success: false, message: "Server error! user not found.." });
        }
    
        const token = userData.generateTokens()
    
        if (!token) {
            return res.status(500).json({ success: false, message: "Server error! token not generated.." });
        }
    
        userData.token = token
        userData.save({ validateBeforeSave: false })
    
        const options = {
            httpOnly: true,
            secure: false
        }
    
        return res.status(200).cookie("token", token, options).json({ success: true, user: userData, message: "User fetched Successfully.." });
    
    } catch (error) {
        return res.status(400).json({success : false , message : error.message ||  "Server error! User login failed.."});
    }
}

export const logoutUser = async (req, res) => {

    try {
        const user = req?.user;
    
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorised user.." });
        }
    
        user.token = ""
        user.save({ validateBeforeSave: false })
    
        res.status(200).clearCookie("token").json({ success: true, message: "User logout successfully" })
    } catch (error) {
        return res.status(400).json({success : false , message : error.message || "Server error! user logout failed.."});
    }

}

export const getUserById = async (req, res) => {

    try {
        const { userId } = req.params;
    
        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ success: false, message: "Please provide valid userId.." });
        }
    
        const user = await userModel.findById(userId).select("-password");
    
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found.." });
        }
    
        return res.status(200).json({ success: true, user: user, message: "userData fetched successfully.." });
    } catch (error) {
        return res.status(500).json({success : false , message : error.message || "Server error! userData not fetched.."});
    }

}

export const validateToken = async (req , res) => {

    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1]
    
        if (!token) {
            return res.status(400).json({ success: false, message: "Please provide valid token.." });
        }
    
        const decode = jwt.verify(token , process.env.TOKEN_SECRET)
    
        if (!decode) {
            return res.status(400).json({ success: false, message: "Invalid token.." });
        }
    
        const user = await userModel.findById(decode._id).select("-password")
    
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Token! unauthorised user.." });
        }
    
        if (token !== user.token) {
            return res.status(400).json({ success: false, message: "Incorrect token.." });
        }
    
        return res.status(200).json({ success: true, message: "Authorised user.." });
        
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "server Error! token not checked .." });
    }

}

export const getAllUsers = async (req , res) => {

    const {sender} = req.params;
    console.log("sender : " , sender)

    const users = await userModel.find({_id : {$ne : sender}}).select("-password")

    return res.status(200).json({ success: true, users : users , message: "Users fetched successfully.." });

}

export const updateStatus = async (req , res) => {

    const {userId} = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
        return res.status(400).json({success : false , message : "Please provide valid Id"})
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
        return res.status(404).json({success : false , message : "User not found"})
    }

    userData.status = "offline"
    userData.save({validateBeforeSave : false});

    return res.status(200).json({success : true , message : "status updated..."})

}

export const getUser = async (req , res) => {

    const user = req?.user;

    if (!user) {
        return res.status(410).json({success : false , message : "Un Authorised User.."})
    }

    return res.status(200).json({success : true , user : user , message : "User fetched Successfully..."})

}