import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addStudy,
  getStudy,
  getWeeklyStudy,
  getSubjects,
} from "../controllers/studyController.js";

const router = express.Router();

router.post("/", authMiddleware, addStudy);

router.get("/", authMiddleware, getStudy);

router.get("/weekly", authMiddleware, getWeeklyStudy);

router.get("/subjects", authMiddleware, getSubjects);

export default router;