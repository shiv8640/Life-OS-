import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "health",
        "study",
        "habit",
        "goal",
        "productivity",
        "general",
      ],
      default: "general",
    },

    title: {
      type: String,
      required: true,
    },

    insight: {
      type: String,
      required: true,
    },

    recommendation: {
      type: String,
      required: true,
    },

    evidence: {
      type: Array,
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const AIInsight = mongoose.model("AIInsight", aiInsightSchema);

export default AIInsight;