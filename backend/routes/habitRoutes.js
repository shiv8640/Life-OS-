import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  logHabit,
  getHabitLogs,
} from "../controllers/habitController.js";

const router = express.Router();

router.post("/", authMiddleware, createHabit);

router.get("/", authMiddleware, getHabits);

router.put("/:id", authMiddleware, updateHabit);

router.delete("/:id", authMiddleware, deleteHabit);

router.post("/:id/log", authMiddleware, logHabit);

router.get("/:id/logs", authMiddleware, getHabitLogs);

export default router;