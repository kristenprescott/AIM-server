const { gql } = require("apollo-server");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
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
