import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getUserAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getUserAnalytics
);

export default router;