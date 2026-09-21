import mongoose from "mongoose";

const studySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    studyHours: {
      type: Number,
      required: true,
      min: 0,
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    focusScore: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

studySchema.index({ userId: 1, date: 1 });

const Study = mongoose.model("Study", studySchema);

export default Study;