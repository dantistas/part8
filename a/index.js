const { ApolloServer, gql } = require('apollo-server')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');




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

  type Query {
      
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String ): [Book!]!
    allAuthors: [Author!]!  

  }


`


const resolvers = {

  Query: {
    allAuthors: async () => await Author.find({}),
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks : async  (root, {author, genre}) => author ? await Book.find({author: author}) : genre ? await Book.find({genres: genre}) : await Book.find({}),
  },
  Book: {
    author: async (book) => {const a = await Author.find({_id: book.author}); return a[0]}
  },

  Author: {
    bookCount: async (author) => {const books = await Book.find({author: author._id}); return books.length }
  },

  Mutation: {

    addBook: async (root, args)  => {
        console.log("args: ",args)

        const authorMatch = await Author.findOne({name: args.author}) 
        console.log("rado / nerado ???: ", authorMatch)

         if(!authorMatch){
            const author = await new Author({name: args.author, id: uuidv4()})
            author.save()
            const book = await new Book({...args, author: author._id})
            book.save()
            return book
         } else {
          const book = await new Book({...args, author: authorMatch._id})
          book.save()
          return book

         }
         


    },

    editAuthor: async (root, args) => {

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






const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})