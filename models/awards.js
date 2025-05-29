"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Awards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Awards.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      desc: DataTypes.TEXT,
      image: DataTypes.STRING,
      date_received: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Awards",
    }
  );
  return Awards;
};
