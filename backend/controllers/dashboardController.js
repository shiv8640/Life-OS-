import Health from "../models/Health.js";
import Study from "../models/Study.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import Goal from "../models/Goal.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      health,
      study,
      habits,
      goals,
    ] = await Promise.all([
      Health.find({ userId }).sort({ date: -1 }).limit(7),

      Study.find({ userId }).sort({ date: -1 }).limit(7),

      Habit.find({ userId, active: true }),

      Goal.find({ userId }).sort({ targetDate: 1 }),
    ]);

    const habitIds = habits.map((habit) => habit._id);

    const habitLogs = await HabitLog.find({
      userId,
      habitId: { $in: habitIds },
    })
      .sort({ date: -1 })
      .limit(30);

    const totalStudyHours = study.reduce(
      (total, item) => total + item.studyHours,
      0
    );

    const completedGoals = goals.filter(
      (goal) => goal.status === "completed"
    ).length;

    const completedHabitLogs = habitLogs.filter(
      (log) => log.completed
    ).length;

    res.json({
      success: true,

      dashboard: {
        health,
        study,
        habits,
        habitLogs,
        goals,

        statistics: {
          totalStudyHours,
          totalHabits: habits.length,
          completedHabitLogs,
          totalGoals: goals.length,
          completedGoals,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};