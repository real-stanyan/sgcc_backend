import express from "express";
import {
  ReturnAllYaoWen,
  AddNewYaoWen,
  ReturnYaoWenByID,
} from "../controllers/yaowenController.js";

const router = express.Router();

router.get("/returnAllYaowen", ReturnAllYaoWen);
router.post("/addNewYaowen", AddNewYaoWen);
router.get("/yaowen/:id", ReturnYaoWenByID);

export default router;
