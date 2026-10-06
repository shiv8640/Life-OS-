import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Study = sequelize.define(
  "Study",
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

    subject: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    studyHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: "study_hours",
    },

    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },

    focusScore: {
      type: DataTypes.INTEGER,
      field: "focus_score",
      validate: {
        min: 1,
        max: 10,
      },
    },
  },
  {
    tableName: "study",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        fields: ["user_id", "date"],
      },
    ],
  }
);

export default Study;