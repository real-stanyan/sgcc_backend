import express from "express";
import { ReturnAllYaoWen } from "../controllers/yaowenController.js";

const router = express.Router();

router.get("/returnAllYaowen", ReturnAllYaoWen);

export default router;
