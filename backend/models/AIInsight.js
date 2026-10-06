import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AIInsight = sequelize.define(
  "AIInsight",
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

    type: {
      type: DataTypes.ENUM(
        "health",
        "study",
        "habit",
        "goal",
        "productivity",
        "general"
      ),
      defaultValue: "general",
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    insight: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    recommendation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    evidence: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: "ai_insights",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default AIInsight;