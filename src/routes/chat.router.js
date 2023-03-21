import express from "express";
import { renderChat } from "../controllers/chat.controller";

const router = express.Router();

router.get("/", renderChat);

export default router;