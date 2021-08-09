"use strict";
const { Model } = require("sequelize");
const { Role } = require("../models");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // User.associate = function () {
      //   User.belongsTo(Role, {
      //     foreignKey: {
      //       name: "roleId",
      //       type: DataTypes.STRING,
      //     },
      //   });
      // };
      User.belongsToMany(User, {
        as: "buddies",
        through: "buddyList",
        foriegnKey: "userId",
      });
      User.belongsToMany(User, {
        as: "Requestees",
        through: "friendRequests",
        foriegnKey: "requesterId",
        onDelete: "CASCADE",
      });
      User.belongsToMany(User, {
        as: "Requesters",
        through: "friendRequests",
        foriegnKey: "requesteeId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      // Fields:
      screenname: {
        type: DataTypes.STRING(42),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING(100),
        validate: {
          isEmail: {
            args: true,
            msg: "must be a valid email address",
          },
        },
      },
      phoneNumber: DataTypes.STRING(15),
      buddyInfo: DataTypes.STRING,
      imagePath: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
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
