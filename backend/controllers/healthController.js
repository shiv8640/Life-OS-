import Health from "../models/Health.js";

export const addHealth = async (req, res) => {
  try {
    const {
      date,
      sleepHours,
      waterIntake,
      exerciseMinutes,
      wellness,
    } = req.body;

    const health = await Health.create({
      userId: req.user.id,
      date,
      sleepHours,
      waterIntake,
      exerciseMinutes,
      wellness,
    });

    res.status(201).json({
      success: true,
      message: "Health data added successfully",
      health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add health data",
      error: error.message,
    });
  }
};

export const getHealth = async (req, res) => {
  try {
    const health = await Health.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["date", "DESC"]],
    });

    res.json({
      success: true,
      count: health.length,
      health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch health data",
      error: error.message,
    });
  }
};

export const getHealthByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const health = await Health.findOne({
      where: {
        userId: req.user.id,
        date,
      },
    });

    if (!health) {
      return res.status(404).json({
        success: false,
        message: "No health data found for this date",
      });
    }

    res.json({
      success: true,
      health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch health data",
      error: error.message,
    });
  }
};