import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Goal = sequelize.define(
  "Goal",
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

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    targetDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "target_date",
    },

    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },

    status: {
      type: DataTypes.ENUM(
        "not-started",
        "in-progress",
        "completed"
      ),
      defaultValue: "not-started",
    },
  },
  {
    tableName: "goals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["user_id", "target_date"],
      },
    ],
  }
);

export default Goal;