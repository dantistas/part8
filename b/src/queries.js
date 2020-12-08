import { gql  } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published 
    genres
    author {
      name 
      born
      bookCount
    }
  }
`

export  const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`