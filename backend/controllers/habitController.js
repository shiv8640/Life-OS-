import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";

export const createHabit = async (req, res) => {
  try {
    const { name, frequency, target } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Habit name is required",
      });
    }

    const habit = await Habit.create({
      userId: req.user.id,
      name,
      frequency,
      target,
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create habit",
      error: error.message,
    });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: habits.length,
      habits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch habits",
      error: error.message,
    });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    await habit.update(req.body);

    res.json({
      success: true,
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update habit",
      error: error.message,
    });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // Delete related habit logs
    await HabitLog.destroy({
      where: {
        habitId: habit.id,
        userId: req.user.id,
      },
    });

    // Delete habit
    await habit.destroy();

    res.json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete habit",
      error: error.message,
    });
  }
};

export const logHabit = async (req, res) => {
  try {
    const { date, completed } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Check habit belongs to current user
    const habit = await Habit.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // Check if log already exists
    let log = await HabitLog.findOne({
      where: {
        habitId: habit.id,
        userId: req.user.id,
        date,
      },
    });

    if (log) {
      // Update existing log
      await log.update({
        completed,
      });
    } else {
      // Create new log
      log = await HabitLog.create({
        habitId: habit.id,
        userId: req.user.id,
        date,
        completed,
      });
    }

    res.status(201).json({
      success: true,
      message: "Habit log saved successfully",
      log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save habit log",
      error: error.message,
    });
  }
};

export const getHabitLogs = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const logs = await HabitLog.findAll({
      where: {
        habitId: habit.id,
        userId: req.user.id,
      },
      order: [["date", "DESC"]],
    });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch habit logs",
      error: error.message,
    });
  }
};