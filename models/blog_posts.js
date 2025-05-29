"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Blog_posts extends Model {
    static associate(models) {}
  }

  Blog_posts.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      content: DataTypes.TEXT,
      image: DataTypes.STRING,
      published_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Blog_posts",
    }
  );

  return Blog_posts;
};
