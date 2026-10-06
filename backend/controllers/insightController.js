import getAnalytics from "../services/analyticsService.js";
import generateInsights from "../services/aiService.js";
import AIInsight from "../models/AIInsight.js";

export const generateUserInsights = async (req, res) => {
  try {
    const analytics = await getAnalytics(req.user.id);

    const insights = await generateInsights(analytics);

    const savedInsights = await Promise.all(
      insights.map((insight) =>
        AIInsight.create({
          userId: req.user.id,
          ...insight,
        })
      )
    );

    res.json({
      success: true,
      count: savedInsights.length,
      insights: savedInsights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate insights",
      error: error.message,
    });
  }
};

export const getUserInsights = async (req, res) => {
  try {
    const insights = await AIInsight.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      count: insights.length,
      insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insights",
      error: error.message,
    });
  }
};