import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recomended from './components/Recomended'
import {BOOK_ADDED} from './queries'

import { gql, useQuery, useApolloClient, useSubscription } from '@apollo/client'

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
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState("")

  const result = useQuery(ALL_BOOKS_AND_AUTHORS)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS_AND_AUTHORS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS_AND_AUTHORS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
      onSubscriptionData: ({ subscriptionData }) => {
        const addedBook = subscriptionData.data.bookAdded
        window.alert(`Book: ${addedBook.title} by: ${addedBook.author.name} was added `)
        updateCacheWith(addedBook)
      }
    })

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
        {!user ? <button onClick={() => setPage('login')}>login</button> :[<button onClick={() => setPage('add')}>add book</button>,
                                                                            <button onClick={() => setPage('recomended')}>Recomended</button>, 
                                                                            <button onClick={() => {setToken(null); localStorage.clear(); client.resetStore()}}>logout</button>]
        }
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
      <Login
        initialiseQuery={ALL_BOOKS_AND_AUTHORS}
        setToken={setToken}
        setUser={setUser}
        setNotification={setNotification}
        show={page === 'login'}
      />
      <Recomended
        user={user}
        books={result.data.allBooks}
        show={page === 'recomended'}
      />

    </div>
  )
}

export default App