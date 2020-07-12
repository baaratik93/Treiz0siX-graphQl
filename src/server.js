const { GraphQLServer } = require('graphql-yoga')
require('dotenv').config();
const mongoose		=	require('mongoose');
const User 		=	require('../models/user')

mongoose.connect(process.env.DB_SHELL, { useNewUrlParser: true })

let db = mongoose.connection;
db.on('error',(error) => console.error(error));
db.once('open',() => console.log("Connected"));
// 1
const typeDefs = `
type User {
    _id: ID!
    prenom: String!
    nom: String!
    email: String!
    password: String!
    
}
                        input InputUser {
                            prenom: String!
                            nom: String!
                            email: String!
                            password: String
                            
                        }
type Article {
    _id: ID!
    nom: String!
    datePublication: String!
    author: User!
}
                            input InputArticle {
                                nom: String!
                                datePublication: String!
                            }
type Query {
    articles: [Article!]
    users: [User!]!
    articlesByUser: [Article!]!
}
type Mutation {
    createArticle(inputArticle: InputArticle): Article
    createUser(inputUser: InputUser): User
}

`

// 2
const resolvers = {
   Query: {
    users: async () => {
        const users = await User.find()
            try
            {
                    return users.map(user=>{
                        return {
                                ...user._doc,
                            
                            };
                    })
            }catch(err)
            {
                throw err;
            }
        
    }
   },
   Mutation: {
    createUser: async args => {
        const user = await User.findOne({email: args.inputUser.email})
         try{
             if(user) {
                 throw new Error("Ce mail existe déja")
             }
              bcrypt.hash(args.inputUser.password,12,async (err,hashed)=>{
                 if(hashed){
                     const user = await  new User({
                         nom: args.inputUser.nom,
                         prenom: args.inputUser.prenom,
                         email: args.inputUser.email,
                         password: hashed
                     }).save()
                       try{
                           user ? console.log(user+(" ajouté avec succès")) : console.error(user+(" anon ajouté"))
                       } catch(err){
                                 throw new err;
                             }
     
                 } 
                throw new Error('Erreur de hachage');
                 
             })
             
         }catch(err)
         {
             throw new Error('Erreur de validation motif: '+err);
         }
     }
   }

}

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
server