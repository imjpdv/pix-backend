import express from "express";
import {
  createPixController,
  getPixStatusController
} from "../controllers/pix.controller.js";
import { mercadoPagoWebhook } from "../webhooks/mercadoPago.webhook.js";

export default function createPixRoutes(db) {
  const router = express.Router();

  router.post("/create", createPixController(db));
  router.get("/status/:id", getPixStatusController);
  router.post("/webhook", mercadoPagoWebhook(db));

  return router;
}