import Study from "../models/Study.js";

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
      userId: req.user._id,
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
    const study = await Study.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: study.length,
      study,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch study data",
    });
  }
};

export const getWeeklyStudy = async (req, res) => {
  try {
    const today = new Date();

    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const study = await Study.find({
      userId: req.user._id,
      date: {
        $gte: weekAgo,
        $lte: today,
      },
    }).sort({ date: 1 });

    const totalHours = study.reduce(
      (total, item) => total + item.studyHours,
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
    });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Study.aggregate([
      {
        $match: {
          userId: req.user._id,
        },
      },
      {
        $group: {
          _id: "$subject",
          totalHours: {
            $sum: "$studyHours",
          },
          averageProgress: {
            $avg: "$progress",
          },
        },
      },
      {
        $sort: {
          totalHours: -1,
        },
      },
    ]);

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject statistics",
    });
  }
};