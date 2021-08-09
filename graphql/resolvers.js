const bcrypt = require("bcrypt");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// Now fetching Users from database, so we import User model
const { User } = require("../models");
const { JWT_SECRET } = require("../config/env.json");

// A map of functions which return data for the schema -
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves users from the "users" array above.
module.exports = resolvers = {
  Query: {
    getUsers: async (_, ___, context) => {
      try {
        let user;
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }
            user = decodedToken;
          });
        }

        const users = await User.findAll({
          where: { screenname: { [Op.ne]: user.screenname } },
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    getUser: async (_, args) => {
      const { screenname } = args;
      let errors = {};

      try {
        if (screenname.trim() === "")
          errors.screenname = "screenname must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { screenname },
        });

        if (!user) {
          errors.screenname = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    signOn: async (_, args) => {
      const { screenname, password } = args;
      let errors = {};

      // Validation:
      try {
        // Check for empty name/password fields
        if (screenname.trim() === "")
          errors.screenname = "screenname must not be empty";
        if (password === "") errors.password = "password must not be empty";

        // Check for errors
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { screenname },
        });

        // Check if screenname exists
        if (!user) {
          errors.screenname = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        // Check if password is correct
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new AuthenticationError("password is incorrect", { errors });
        }

        // Check if token is expired
        const token = jwt.sign({ screenname }, JWT_SECRET, {
          expiresIn: "1h",
        });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    signUp: async (_, args, context, info) => {
      let { screenname, password, role } = args;
      // errors object to throw & return to client
      let errors = {};
      try {
        // If no value entered for role, default to 'user'
        if (role === "") {
          role = await "user";
        }

        // If errors, throw errors
        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // // Hash password
        // if (!password === "") {
        //   const salt = await bcrypt.genSalt(15);
        //   password = await bcrypt.hash(password, salt);
        // }
        // Hash password
        password = await bcrypt.hash(password, 6);

        // If valid, create user
        const user = await User.create({
          screenname,
          password,
          role,
        });

        // Return user - this returns a JSON version of user
        return user;
      } catch (err) {
        console.error(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken.`)
          );
        }
        if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = `${e.path} is invalid.`));
        }
        throw new UserInputError("BAD USER INPUT", { errors });
      }
    },
    updateUserInfo: async (
      _,
      { id, screenname, buddyInfo, email, phoneNumber, imagePath, updatedAt }
    ) => {
      // let updatedUser;
      try {
        const updatedUser = await User.findOne({ where: { id } });
        //
        updatedUser = {
          id: user.id,
          // first check if values are provided
          screenname: screenname !== undefined ? screenname : user.screenname,
          buddyInfo: buddyInfo !== undefined ? buddyInfo : user.buddyInfo,
          email: email !== undefined ? email : user.email,
          phoneNumber:
            phoneNumber !== undefined ? phoneNumber : user.phoneNumber,
          imagePath: imagePath !== undefined ? imagePath : user.imagePath,
        };
        return {
          ...updatedUser.toJSON(),
          updatedAt: updatedUser.updatedAt.toISOString(),
        };
      } catch (err) {
        console.log(err);
      }
    },
    // updateUser: async (_, args) => {
    //   const { screenname, buddyInfo } = args;
    //   try {
    //     const user = await User.update(
    //       { screenname, buddyInfo },
    //       { where: { id } }
    //     );
    //     // return { id: args.id, screenname: args.screenname,buddyInfo: args.buddyInfo}
    //     return {
    //       ...user.toJSON(),
    //       updatedAt: user.updatedAt.toISOString(),
    //     };
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    deleteUser: async (_, { id }) => {
      const user = await User.destroy({ where: { id } });
      console.log("User destroyed.");
      return `User ${user.screenname} destroyed.`;
    },
  },
};
