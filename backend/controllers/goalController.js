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
      userId: req.user.id,
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
    const goals = await Goal.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["targetDate", "ASC"]],
    });

    res.json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
      error: error.message,
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    await goal.update(req.body);

    res.json({
      success: true,
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update goal",
      error: error.message,
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    await goal.destroy();

    res.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete goal",
      error: error.message,
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

    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    await goal.update({
      progress,
      status,
    });

    res.json({
      success: true,
      message: "Goal progress updated",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update goal progress",
      error: error.message,
    });
  }
};