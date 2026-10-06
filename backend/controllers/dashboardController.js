import Health from "../models/Health.js";
import Study from "../models/Study.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import Goal from "../models/Goal.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [health, study, habits, goals] = await Promise.all([
      Health.findAll({
        where: { userId },
        order: [["date", "DESC"]],
        limit: 7,
      }),

      Study.findAll({
        where: { userId },
        order: [["date", "DESC"]],
        limit: 7,
      }),

      Habit.findAll({
        where: {
          userId,
          active: true,
        },
      }),

      Goal.findAll({
        where: { userId },
        order: [["targetDate", "ASC"]],
      }),
    ]);

    // Get active habit IDs
    const habitIds = habits.map((habit) => habit.id);

    let habitLogs = [];

    // Only query logs if user has active habits
    if (habitIds.length > 0) {
      habitLogs = await HabitLog.findAll({
        where: {
          userId,
          habitId: habitIds,
        },
        order: [["date", "DESC"]],
        limit: 30,
      });
    }

    // Calculate total study hours
    const totalStudyHours = study.reduce(
      (total, item) => total + Number(item.studyHours || 0),
      0
    );

    // Count completed goals
    const completedGoals = goals.filter(
      (goal) => goal.status === "completed"
    ).length;

    // Count completed habit logs
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