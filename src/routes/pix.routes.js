import express from "express";
import {
  createPixController,
  getPixStatusController
} from "../controllers/pix.controller.js";

export default function createPixRoutes() {
  const router = express.Router();

  router.post("/create", createPixController());
  router.get("/status/:id", getPixStatusController);

  return router;
}