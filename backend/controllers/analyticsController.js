import getAnalytics from "../services/analyticsService.js";

export const getUserAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalytics(req.user._id);

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
};