'use strict'

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql')
const { createHandler } = require('graphql-http/lib/use/express')

const { typeDefs } = require('./schemas')
const { resolvers } = require('./resolves')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      test: {
        type: GraphQLString,
        resolve: () => {
          
        },
      },
    },
  }),
});


module.exports = createHandler({ schema })