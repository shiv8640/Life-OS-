import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  generateUserInsights,
  getUserInsights,
} from "../controllers/insightController.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateUserInsights
);

router.get(
  "/",
  authMiddleware,
  getUserInsights
);

export default router;