import { Router } from "express";
import { getMessages } from "../controllers/conversation.controller.js";

const router = Router();

router.get("/get-msg/:receiver/:sender" , getMessages)

export default router;