const { gql } = require("apollo-server");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  # This "User" type defines the queryable fields for every user in our data source.
  type User {
    id: ID!
    screenname: String!
    role: String
    buddyInfo: String
    buddies: [User]
    email: String
    phoneNumber: String
    imagePath: String
    token: String
    updatedAt: String
  }
  # type Role {
  #   id: ID!
  #   name: String!
  # }
  type Buddy {
    screenname: String!
  }
  # Query: lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "getUsers" query returns an array of zero or more Users (defined above).
  type Query {
    # ! = this array must exist, even if empty
    getUsers: [User]!
    getUser(screenname: String!, id: String): User
    signOn(screenname: String!, password: String!): User!
  }
  type Mutation {
    signUp(screenname: String!, password: String!, role: String!): User!
    updateUserInfo(
      id: String!
      screenname: String
      buddyInfo: String
      email: String
      phoneNumber: String
      imagePath: String
    ): User!
    updateUser(id: String!, screenname: String!, buddyInfo: String): User
    deleteUser(id: String!): User
  }
`;
