import React, { useState, useEffect } from 'react'


import { gql, useLazyQuery } from '@apollo/client'

const RECOMENDED_BOOKS = gql`

    query byGenre($genre:String!){
        allBooks(genre: $genre){
            title
            published
            author{
                name
                born
                bookCount
            }
            genres
        }
    }


`


const Recomended = (props) => {

    const [getRecomendedBooks, result] = useLazyQuery(RECOMENDED_BOOKS)
    const [recomendedBooks, setRecomendedBooks] = useState(null)

      useEffect(() => {
        if(props.user){
            getRecomendedBooks({ variables: { genre: props.user.favoriteGenre } })
        }
      }, [props.user])
      
      useEffect(()=>{
        if (result.data) {
            setRecomendedBooks(result.data.allBooks)
        }
      },[result])



    if(!props.show){
        return null
    }else {
        if(!recomendedBooks){
            return <div>There are no recomendations, because you did not set your favorite genre yet!</div>
        }else {
            return (
                <div>
                <h2>Recomended for you: </h2>
                <table>
                    <tbody>
                    <tr>
                        <th> 
                        Title
                        </th>
                        <th>
                        Author
                        </th>
                        <th>
                        Published
                        </th>
                    </tr>
                    {recomendedBooks.map(b =>
                        <tr key={b.title}>
                        <td>{b.title}</td>
                        <td>{b.author.name}</td>
                        <td>{b.published}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            )
        }
    }

    

}

export default Recomended