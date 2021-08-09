const bcrypt = require("bcrypt");
const { UserInputError } = require("apollo-server");

// Now fetching Users from database, so we import User model
const { User } = require("../models");

// A map of functions which return data for the schema -
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves users from the "users" array above.
module.exports = resolvers = {
  Query: {
    getUsers: async (parent, args, { models }) => {
      // Now that we're fetching Users from DB using async/await, we need a try/catch
      try {
        const users = await User.findAll({
          include: [{ model: models.Role, as: "role" }],
        });
        return users;
      } catch (err) {
        console.log(err);
      }
    },
    getUser: async (parent, { id }, { models }) => {
      try {
        const user = await User.findByPk(id);
        return user;
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    signUp: async (_, args, context, info) => {
      let { screenname, password, role } = args;
      // errors object to throw & return to client
      let errors = {};
      try {
        // MOVED VALIDATION TO MODEL
        // // Validate input data != empty
        // if (screenname.trim() === "")
        //   errors.screenname = "Screenname field cannot be empty.";
        // if (password === "")
        //   errors.password = "Password field cannot be empty.";

        // MOVED VALIDATION TO MODEL
        // // Check if screenname exists
        // const userByScreenname = await User.findOne({ where: { screenname } });
        // if (userByScreenname) errors.screenname = "Screenname is taken.";

        // If no value entered for role, default to 'user'
        if (role === "") {
          role = await "user";
        }

        // If errors, throw errors
        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        if (!password === "") {
          password = await bcrypt.hash(password, 6);
        }

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
  },
};

/*
//USER
setUserById(req, res, next, id) {
  console.log('Set router.param for :userId');
  db.User.findById(id)
    .then(user => {
      if (!user) res.sendStatus(404);
      else {
        req.user = user;
        next();
      }
    })
    .catch(next);
},

getUserById(req, res) {
  console.log("Get user by id");
  res.send(req.user);
},

putSubscription(req, res, next) {
  console.log('Subscribe user to the team');
  req.user.addSubscriptions(req.body.teamId)
    .then(result => res.status(201).send(result))
    .catch(next);
},

getSubscription(req, res, next) {
  console.log('Get all teams the user is subscribed to');
  req.user.getSubscriptions()
    .then(result => res.status(201).send(result))
    .catch(next);
},

putFriendRequest(req, res, next) {
  if (req.body.requesteeId != req.user.id) {
    console.log('Send friend request');
    req.user.addRequestees(req.body.requesteeId)
      .then(result => res.status(201).send(result))
      .catch(next);
  } else {
    res.status(400).send('Cannot friend yourself');
  }
},
...
*/
