import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Habit = sequelize.define(
  "Habit",
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

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    frequency: {
      type: DataTypes.ENUM("daily", "weekly"),
      defaultValue: "daily",
    },

    target: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "habits",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Habit;