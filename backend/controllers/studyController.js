import Study from "../models/Study.js";
import { Op } from "sequelize";

export const addStudy = async (req, res) => {
  try {
    const {
      subject,
      date,
      studyHours,
      progress,
      focusScore,
    } = req.body;

    if (!subject || !date || studyHours === undefined) {
      return res.status(400).json({
        success: false,
        message: "Subject, date and study hours are required",
      });
    }

    const study = await Study.create({
      userId: req.user.id,
      subject,
      date,
      studyHours,
      progress,
      focusScore,
    });

    res.status(201).json({
      success: true,
      message: "Study data added successfully",
      study,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add study data",
      error: error.message,
    });
  }
};

export const getStudy = async (req, res) => {
  try {
    const study = await Study.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["date", "DESC"]],
    });

    res.json({
      success: true,
      count: study.length,
      study,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch study data",
      error: error.message,
    });
  }
};

export const getWeeklyStudy = async (req, res) => {
  try {
    const today = new Date();

    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);

    const todayString = today.toISOString().split("T")[0];
    const weekAgoString = weekAgo.toISOString().split("T")[0];

    const study = await Study.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.between]: [weekAgoString, todayString],
        },
      },
      order: [["date", "ASC"]],
    });

    const totalHours = study.reduce(
      (total, item) => total + Number(item.studyHours || 0),
      0
    );

    res.json({
      success: true,
      totalHours,
      entries: study,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly study data",
      error: error.message,
    });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const study = await Study.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["date", "DESC"]],
    });

    // Group subject-wise in JavaScript
    const subjectMap = {};

    study.forEach((item) => {
      const subject = item.subject;

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          _id: subject,
          totalHours: 0,
          totalProgress: 0,
          count: 0,
        };
      }

      subjectMap[subject].totalHours += Number(item.studyHours || 0);
      subjectMap[subject].totalProgress += Number(item.progress || 0);
      subjectMap[subject].count += 1;
    });

    const subjects = Object.values(subjectMap)
      .map((item) => ({
        _id: item._id,
        totalHours: item.totalHours,
        averageProgress:
          item.count > 0
            ? item.totalProgress / item.count
            : 0,
      }))
      .sort((a, b) => b.totalHours - a.totalHours);

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject statistics",
      error: error.message,
    });
  }
};