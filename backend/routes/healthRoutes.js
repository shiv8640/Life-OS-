import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addHealth,
  getHealth,
  getHealthByDate,
} from "../controllers/healthController.js";

const router = express.Router();

router.post("/", authMiddleware, addHealth);

router.get("/", authMiddleware, getHealth);

router.get(
  "/:date",
  authMiddleware,
  getHealthByDate
);

export default router;