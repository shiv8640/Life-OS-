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
      userId: req.user._id,
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
    const health = await Health.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: health.length,
      health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch health data",
    });
  }
};

export const getHealthByDate = async (req, res) => {
  try {
    const start = new Date(req.params.date);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const health = await Health.findOne({
      userId: req.user._id,
      date: {
        $gte: start,
        $lt: end,
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
    });
  }
};