import Goal from "../models/Goal.js";

export const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      targetDate,
      progress,
      status,
    } = req.body;

    if (!title || !targetDate) {
      return res.status(400).json({
        success: false,
        message: "Title and target date are required",
      });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      description,
      targetDate,
      progress,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create goal",
      error: error.message,
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.user._id,
    }).sort({ targetDate: 1 });

    res.json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update goal",
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete goal",
    });
  }
};

export const updateGoalProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (
      progress === undefined ||
      progress < 0 ||
      progress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    let status = "in-progress";

    if (progress === 0) {
      status = "not-started";
    }

    if (progress === 100) {
      status = "completed";
    }

    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        progress,
        status,
      },
      {
        new: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal progress updated",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update goal progress",
    });
  }
};