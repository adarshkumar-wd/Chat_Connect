import { Router } from "express";
import { createmessage, deleteMessageFromDatabase, getMessages } from "../controllers/deleteMessage.controller.js";

const router = Router();

router.get("/message/:messageId/sender/:senderId/receiver/:receiverId/deletedBy/:deletedBy" , createmessage);
router.get("/message/get/firstuser/:firstuser/seconduser/:seconduser" , getMessages);
router.put("/message/:messageId/from-both-user" , deleteMessageFromDatabase);

export default router;