
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { gql, useQuery } from '@apollo/client'
// bookCount i allauthors ir author i allbooks

const ALL_BOOKS_AND_AUTHORS = gql`

query{

  allAuthors{
    name
    born
    bookCount
    id
  }

  allBooks{
    title
    published
    author{name}
    id
    genres
  }

}

`


const App = () => {
  const [page, setPage] = useState('authors')


  const result = useQuery(ALL_BOOKS_AND_AUTHORS)



  if(result.loading){
    return (
      <div>loading...</div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={()=>{console.log(result.data)}}>click</button>
      </div>
 
      <Authors 
        initialiseQuery={ALL_BOOKS_AND_AUTHORS}
        authors={result.data.allAuthors}
        show={page === 'authors'}
      />
      <Books
        books={result.data.allBooks}
        show={page === 'books'}
      />
      <NewBook
        initialiseQuery={ALL_BOOKS_AND_AUTHORS}
        show={page === 'add'}
      />

    </div>
  )
}

export default App