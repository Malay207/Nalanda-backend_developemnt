const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const resolvers = require("./resolvers");

const graphqlMiddleware = graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers(req),
    graphiql: true, // GraphQL Playground
}));

module.exports = graphqlMiddleware;
