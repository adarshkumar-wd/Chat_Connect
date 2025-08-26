import { Router } from "express";
import { loginUser, registerUser , logoutUser, getUserById, validateToken, getAllUsers, updateStatus , getUser } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authUser.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.post("/register", upload.single("avatar") , registerUser)
router.post("/login" , loginUser)
router.get("/logout" , authUser , logoutUser)
router.get("/get-user/:userId" , getUserById)
router.get("/validate-token" , validateToken)
router.get("/get-users/sender/:sender" , getAllUsers)
router.get("/update-status/:userId"  , updateStatus)
router.get("/get-user" , authUser , getUser )

export default router