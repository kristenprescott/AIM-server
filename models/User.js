"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      // Fields:
      screenname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      buddyInfo: DataTypes.STRING,
      bot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // Options:
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
