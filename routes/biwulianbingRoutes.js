import express from "express";
import {
  ReturnAllBiwulianbing,
  AddNewBiwulianbing,
  DeleteBiwulianbingByID,
  GetBiwulianbingByID,
  EditBiwulianbingByID,
  IncreaseBiwulianbingOrderByI,
  DecreaseBiwulianbingOrderByI,
} from "../controllers/biwulianbingeditController.js";

const router = express.Router();

router.get("/returnAllBiwulianbing", ReturnAllBiwulianbing);
router.get("/getbiwulianbingbyid/:id", GetBiwulianbingByID);
router.post("/addnewbiwulianbing", AddNewBiwulianbing);
router.put("/editbiwulianbingbyid/:id", EditBiwulianbingByID);
router.post("/increasebiwulianbingorderbyi/:i", IncreaseBiwulianbingOrderByI);
router.post("/decreasebiwulianbingorderbyI/:i", DecreaseBiwulianbingOrderByI);
router.delete("/deletebiwulianbingbyid/:id", DeleteBiwulianbingByID);

export default router;
