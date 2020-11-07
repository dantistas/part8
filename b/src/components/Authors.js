  
import React, { useState } from 'react'

import { gql, useMutation } from '@apollo/client'

const UPDATE_AUTHOR_DOB = gql`

  mutation updateAuthorDateOfBirth($name: String!, $dateOfBirth: Int!){
    editAuthor(
      name: $name
      setBornTo: $dateOfBirth
    ){
      name
      born
      bookCount
    }

  }



`



const Authors = (props) => {
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  const [updateAuthorDateOfBirth] = useMutation(UPDATE_AUTHOR_DOB, {
    refetchQueries: [ { query: props.initialiseQuery } ]
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors


  const updateAuthor = (event) => {
    event.preventDefault()

    updateAuthorDateOfBirth({variables: {name, dateOfBirth}})
    setName("")
    setDateOfBirth("")
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h1>set birthyear</h1>
      <form onSubmit={updateAuthor}>
            <div>
              <input value={name} onChange={({ target }) => setName(target.value)} placeholder="name"></input>
            </div>
            <div>
              <input type='number' onChange={({ target }) => setDateOfBirth(parseInt(target.value))} value={dateOfBirth} placeholder="year"></input>
            </div>
            <button type="submit">update author</button>
      </form>      

    </div>
  )
}

export default Authors