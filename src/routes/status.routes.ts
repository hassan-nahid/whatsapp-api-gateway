import { Router } from "express";
import { getStatusController } from "../controllers/status.controller";

const router = Router();

router.get("/status", getStatusController);

export default router;
