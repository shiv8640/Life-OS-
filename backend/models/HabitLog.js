import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const HabitLog = sequelize.define(
  "HabitLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    habitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "habit_id",
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

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "habit_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["habit_id", "date"],
      },
    ],
  }
);

export default HabitLog;