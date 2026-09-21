import mongoose from "mongoose";

const healthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    waterIntake: {
      type: Number,
      min: 0,
    },

    exerciseMinutes: {
      type: Number,
      min: 0,
    },

    wellness: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

healthSchema.index({ userId: 1, date: 1 });

const Health = mongoose.model("Health", healthSchema);

export default Health;