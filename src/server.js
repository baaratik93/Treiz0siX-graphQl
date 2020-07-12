const { GraphQLServer } = require('graphql-yoga')
require('dotenv').config();
const mongoose		=	require('mongoose');
const resolvers = require('../graphql/resolvers/index');
mongoose.connect(process.env.DB_SHELL, { useNewUrlParser: true })
let db = mongoose.connection;
db.on('error',(error) => console.error(error));
db.once('open',() => console.log("Connected"));
// 1
// 3
const server = new GraphQLServer({
  typeDefs: 'graphql/schema/index.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
server