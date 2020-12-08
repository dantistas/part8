const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'




const MONGODB_URI = 'mongodb+srv://rytis:rytis123@cluster0-dihxu.mongodb.net/Books?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

  


// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]



const typeDefs = gql`
type Mutation {
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]
  ): Book
  editAuthor(
    name: String!
    setBornTo:Int!
  ): Author
}

type Book {
    title: String!
    published: Int!
    author: Author!                  
    id: ID!
    genres: [String]
}

type Author {
  name: String
  id: ID
  born: Int
  bookCount: Int
}

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
  user: User!
}

type Query {
    me: User  
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String ): [Book!]!
    allAuthors: [Author!]!  
  }
`


const resolvers = {

  Query: {
    me: async (root, args, context ) => {return context.currentUser},
    allAuthors: async () => await Author.find({}),
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks : async  (root, {author, genre}) => author ? await Book.find({author: author}) : genre ? await Book.find({genres: genre}) : await Book.find({}),
  },
  Book: {
    author: async (book) =>  await Author.findOne({_id: book.author})
  },

  Author: {
    bookCount: async (author) => {const books = await Book.find({author: author._id}); return books.length }
  },

  Mutation: {
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secred' ) {
      throw new UserInputError("wrong credentials")
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }


    return { value: jwt.sign(userForToken, JWT_SECRET), user: user }
    },

    createUser: async (root, args) => {
          console.log(args.username)
          const checkUser = await User.findOne({username: args.username})
          if(!checkUser){
            const user = await new User({...args})
            try{
              await user.save()
            }catch(error){
              throw new UserInputError(error.message,{
                invalidArgs:args,
              })
            }return user
          } else {
            throw new UserInputError(error.message, {
              invalidArgs: "user already exist!"
            })
            
          }
         
    },

    addBook: async (root, args, context)  => {
      console.log("args: ",args)
      console.log("useris: ",context.currentUser)
      if(!context.currentUser){
        throw new AuthenticationError("not authenticated")
      }else {
        const authorMatch = await Author.findOne({name: args.author}) 
        console.log("rado / nerado ???: ", authorMatch)

         if(!authorMatch){
            const author = await new Author({name: args.author, id: uuidv4()})
            const book = await new Book({...args, author: author._id})
            try{
              await author.save()
            } catch (error){
              throw new UserInputError(error.message,{
                invalidArgs: args,
              })
            }
            try{
              await book.save()
            } catch(error){
              throw new UserInputError(error.message,{
                invalidArgs: args,
              })
            }   
            return book
         } else {
          const book = await new Book({...args, author: authorMatch._id})
          try{
            await book.save()
          } catch (error){
            throw new UserInputError(error.message,{
              invalidArgs: args,
            })
          }
          return book
         }
      }     
    },

    editAuthor: async (root, args, context) => {
      console.log(args)
      if(!context.currentUser){
        throw new AuthenticationError("not authenticated")
      }else{
        const foundAuthor = await Author.findOne({name: args.name})
        
        if(!foundAuthor){
          return null

        } else {
          foundAuthor.born = args.setBornTo
          foundAuthor.save()
          return foundAuthor
          
        }
      }

      
    }
  
  }
}






const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log("headereis", req.headers.authorization)      
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})