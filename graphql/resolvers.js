// A map of functions which return data for the schema -
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves users from the "users" array above.
module.exports = resolvers = {
  Query: {
    getUsers: () => {
      const users = [
        {
          // The user has an id, which is not defined in typeDefs - that's good. We only tell GraphQL the fields we're interested in getting, and the id field not be sent to the client
          id: 1,
          screenname: "xusernamex",
          buddyInfo: "",
          awayMessage: "",
          bot: false,
        },
        {
          id: 2,
          screenname: "phillis",
          buddyInfo:
            "Hello there! I'm Phyllis, I am 45 years old and I am recently divorced.",
          awayMessage: "",
          bot: false,
        },
      ];

      return users;
    },
  },
};
