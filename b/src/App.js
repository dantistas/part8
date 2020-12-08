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

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert("Book: " + subscriptionData.data.bookAdded.title + " by: " + subscriptionData.data.bookAdded.author.name + " was added!")
    }
  })

  if(result.loading){
    return (
      <div>loading...</div>
    )
  }

  return (
    <div>
      <button onClick={()=>{console.log(notification)}}>notification</button>
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