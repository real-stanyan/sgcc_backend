import express from "express";
import {
  ReturnAllKuaiXun,
  AddNewKuaiXun,
  ReturnKuaiXunByID,
} from "../controllers/kuaixunController.js";

const router = express.Router();

router.get("/returnAllKuaiXun", ReturnAllKuaiXun);
router.post("/addNewKuaiXun", AddNewKuaiXun);
router.get("/KuaiXun/:id", ReturnKuaiXunByID);

export default router;
