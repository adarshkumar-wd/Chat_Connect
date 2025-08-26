import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        minLength : [3 , "name must be atleast 3 charecter long.."]
    },

    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        minLength : [3 , "Email must be atleast 3 character long.."]
    },

    password : {
        type : String,
        required : [true , "Password must be reqired.."],
        minLength : [3 , "Password Must be atleast 3 character long.."]
    },

    token : {
        type : String
    },

    socketId : {
        type : String
    },

    status : {
        type : String,
        default : "offline"
    },

    avatar : {
        type : String,
        // require : [false , "Avatar is mandatory : user-model"]
    },

    friends : [
        {
            type : String
        }
    ],

    friendRequests: [
        {
            type: String
        }
    ]

} , {timestamps : true})

userSchema.pre("save" , async function (next) {

    if (!this.isModified("password")) return next()

    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    this.password = await bcrypt.hash(this.password , salt)
    next()
})

userSchema.methods.checkPassword = async function (password) {

    return await bcrypt.compare(password , this.password)

}

userSchema.methods.generateTokens = function () {

    return jwt.sign({_id : this._id} , process.env.TOKEN_SECRET);

}
export const userModel = mongoose.model("User" , userSchema)