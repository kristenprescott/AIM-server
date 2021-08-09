const { ApolloServer } = require("apollo-server");

// Sequelize instance we just generated
const { sequelize } = require("./models");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

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

  // Sequelize instance methods
  sequelize
    .authenticate()
    .then(() => console.log("DB connected B^D"))
    .catch((err) => console.error(err));
});
