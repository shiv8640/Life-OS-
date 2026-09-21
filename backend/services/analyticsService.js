import Health from "../models/Health.js";
import Study from "../models/Study.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import Goal from "../models/Goal.js";

const getAnalytics = async (userId) => {
  const [
    healthData,
    studyData,
    habits,
    goals,
  ] = await Promise.all([
    Health.find({ userId }).sort({ date: 1 }),

    Study.find({ userId }).sort({ date: 1 }),

    Habit.find({
      userId,
      active: true,
    }),

    Goal.find({ userId }),
  ]);

  const habitIds = habits.map((habit) => habit._id);

  const habitLogs = await HabitLog.find({
    userId,
    habitId: { $in: habitIds },
  }).sort({ date: 1 });

  // -------------------------
  // HEALTH ANALYTICS
  // -------------------------

  const totalSleep = healthData.reduce(
    (sum, item) => sum + (item.sleepHours || 0),
    0
  );

  const totalWater = healthData.reduce(
    (sum, item) => sum + (item.waterIntake || 0),
    0
  );

  const totalExercise = healthData.reduce(
    (sum, item) => sum + (item.exerciseMinutes || 0),
    0
  );

  const averageSleep =
    healthData.length > 0
      ? Number((totalSleep / healthData.length).toFixed(2))
      : 0;

  const averageWater =
    healthData.length > 0
      ? Number((totalWater / healthData.length).toFixed(2))
      : 0;

  const averageExercise =
    healthData.length > 0
      ? Number((totalExercise / healthData.length).toFixed(2))
      : 0;

  // -------------------------
  // STUDY ANALYTICS
  // -------------------------

  const totalStudyHours = studyData.reduce(
    (sum, item) => sum + (item.studyHours || 0),
    0
  );

  const averageFocus =
    studyData.length > 0
      ? Number(
          (
            studyData.reduce(
              (sum, item) => sum + (item.focusScore || 0),
              0
            ) / studyData.length
          ).toFixed(2)
        )
      : 0;

  const averageProgress =
    studyData.length > 0
      ? Number(
          (
            studyData.reduce(
              (sum, item) => sum + (item.progress || 0),
              0
            ) / studyData.length
          ).toFixed(2)
        )
      : 0;

  // -------------------------
  // SUBJECT ANALYTICS
  // -------------------------

  const subjectMap = {};

  studyData.forEach((item) => {
    if (!subjectMap[item.subject]) {
      subjectMap[item.subject] = {
        studyHours: 0,
        entries: 0,
      };
    }

    subjectMap[item.subject].studyHours += item.studyHours || 0;
    subjectMap[item.subject].entries += 1;
  });

  const subjects = Object.entries(subjectMap).map(
    ([subject, data]) => ({
      subject,
      studyHours: Number(data.studyHours.toFixed(2)),
      entries: data.entries,
    })
  );

  // -------------------------
  // HABIT ANALYTICS
  // -------------------------

  const completedLogs = habitLogs.filter(
    (log) => log.completed
  ).length;

  const habitCompletionRate =
    habitLogs.length > 0
      ? Number(
          ((completedLogs / habitLogs.length) * 100).toFixed(2)
        )
      : 0;

  // -------------------------
  // GOAL ANALYTICS
  // -------------------------

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  const activeGoals = goals.filter(
    (goal) => goal.status !== "completed"
  ).length;

  const averageGoalProgress =
    goals.length > 0
      ? Number(
          (
            goals.reduce(
              (sum, goal) => sum + (goal.progress || 0),
              0
            ) / goals.length
          ).toFixed(2)
        )
      : 0;

  // -------------------------
  // RETURN ANALYTICS
  // -------------------------

  return {
    health: {
      records: healthData.length,
      averageSleep,
      averageWater,
      averageExercise,
    },

    study: {
      records: studyData.length,
      totalStudyHours: Number(totalStudyHours.toFixed(2)),
      averageFocus,
      averageProgress,
      subjects,
    },

    habits: {
      totalHabits: habits.length,
      totalLogs: habitLogs.length,
      completedLogs,
      completionRate: habitCompletionRate,
    },

    goals: {
      totalGoals: goals.length,
      completedGoals,
      activeGoals,
      averageProgress: averageGoalProgress,
    },
  };
};

export default getAnalytics;