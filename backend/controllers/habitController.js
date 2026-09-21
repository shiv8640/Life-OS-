import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";

export const createHabit = async (req, res) => {
  try {
    const {
      name,
      frequency,
      target,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Habit name is required",
      });
    }

    const habit = await Habit.create({
      userId: req.user._id,
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
    const habits = await Habit.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: habits.length,
      habits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch habits",
    });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
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

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update habit",
    });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    await HabitLog.deleteMany({
      habitId: habit._id,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete habit",
    });
  }
};

export const logHabit = async (req, res) => {
  try {
    const { date, completed } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const log = await HabitLog.findOneAndUpdate(
      {
        habitId: habit._id,
        userId: req.user._id,
        date: new Date(date),
      },
      {
        completed,
      },
      {
        new: true,
        upsert: true,
      }
    );

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
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    const logs = await HabitLog.find({
      habitId: habit._id,
      userId: req.user._id,
    }).sort({ date: -1 });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch habit logs",
    });
  }
};