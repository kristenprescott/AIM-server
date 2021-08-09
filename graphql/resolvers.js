// Now fetching Users from database, so we import User model
const { User } = require("../models");

// A map of functions which return data for the schema -
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves users from the "users" array above.
module.exports = resolvers = {
  Query: {
    getUsers: async () => {
      // Now that we're fetching Users from DB using async/await, we need a try/catch
      try {
        const users = await User.findAll();

        return users;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
