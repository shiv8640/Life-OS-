import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} from "../controllers/goalController.js";

const router = express.Router();

router.post("/", authMiddleware, createGoal);

router.get("/", authMiddleware, getGoals);

router.put(
  "/:id/progress",
  authMiddleware,
  updateGoalProgress
);
router.put("/:id", authMiddleware, updateGoal);

router.delete("/:id", authMiddleware, deleteGoal);


export default router;