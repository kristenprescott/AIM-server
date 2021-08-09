const { ApolloServer, gql } = require("apollo-server");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # This "User" type defines the queryable fields for every user in our data source.
  type User {
    screenname: String!
    buddyInfo: String
    awayMessage: String
    bot: Boolean
    # token: String
    # createdAt: String!
    # latestMessage: Message
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "getUsers" query returns an array of zero or more Users (defined above).
  type Query {
    # ! = this array must exist, even if empty
    getUsers: [User]!
  }
`;

// A map of functions which return data for the schema -
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves users from the "users" array above.
const resolvers = {
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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// (though there are more optional paramters as well)
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`server listening at ${url}`);
});
