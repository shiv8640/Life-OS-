import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Health = sequelize.define(
  "Health",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    sleepHours: {
      type: DataTypes.DECIMAL(4, 2),
      field: "sleep_hours",
    },

    waterIntake: {
      type: DataTypes.DECIMAL(5, 2),
      field: "water_intake",
    },

    exerciseMinutes: {
      type: DataTypes.INTEGER,
      field: "exercise_minutes",
    },

    wellness: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "health",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "date"],
      },
    ],
  }
);

export default Health;