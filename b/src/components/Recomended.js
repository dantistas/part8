import React, { useState, useEffect } from 'react'


const Recomended = (props) => {



    if(!props.show){
        return null
    }else {
        if(!props.user.favoriteGenre){
            return <div>There are no recomendations, because you did not set your favorite genre yet!</div>
        }else {
                
            const books = props.books.filter((b)=>{
                if(b.genres.indexOf(props.user.favoriteGenre)>= 0){
                  return b
                }
              })
            return (
                <div>
                <button onClick={()=>{console.log(props.user)}}>????</button>
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
                    {books.map(b =>
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