"use strict";
const { Model } = require("sequelize");
const { User } = require("../models");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // Role.associate = function () {
      //   Role.hasMany(User);
      // };
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: false,
    }
  );
  return Role;
};
