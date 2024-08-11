import express from "express";
import { validateWebhook, webhookTrigger } from "../controllers/controllers.js";

const webhookRouter = express.Router();

webhookRouter.get("/", (req, res) => res.send('Hello World'));
webhookRouter.get("/webhook", validateWebhook);
webhookRouter.post("/webhook", webhookTrigger);

export { webhookRouter };
