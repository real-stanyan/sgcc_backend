import express from "express";
import {
  ReturnAllRouxingtuandui,
  AddNewRouxingtuandui,
  DeleteRouxingtuanduiByID,
  GetRouxingtuanduiByID,
  EditRouxingtuanduiByID,
  IncreaseRouxingtuanduiOrderByI,
  DecreaseRouxingtuanduiOrderByI,
} from "../controllers/rouxingtuanduiController.js";

const router = express.Router();

router.get("/returnAllRouxingtuandui", ReturnAllRouxingtuandui);
router.post("/addnewrouxingtuandui", AddNewRouxingtuandui);
router.delete("/deleterouxingtuanduibyid/:id", DeleteRouxingtuanduiByID);
router.put("/editrouxingtuanduibyid/:id", EditRouxingtuanduiByID);
router.post(
  "/increaserouxingtuanduiorderbyi/:i",
  IncreaseRouxingtuanduiOrderByI
);
router.post(
  "/decreaserouxingtuanduiorderbyi/:i",
  DecreaseRouxingtuanduiOrderByI
);
router.get("/getrouxingtuanduibyid/:id", GetRouxingtuanduiByID);

export default router;
