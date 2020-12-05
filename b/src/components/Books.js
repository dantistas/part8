import React, {useState, useEffect} from 'react'

const Books = (props) => {
  const [books, setBooks] = useState([])

  const genres = props.books.map(b => b.genres.map(genre => genre))

  let genreButtons = []

  for(let i = 0; i<genres.length; i++){
    genreButtons.push(...genres[i]) 
}

for(let i = 0 ; i < genreButtons.length ; i++ ){
  for(let j = 0; j<genreButtons.length; j++ ){
    if(genreButtons[i] === (genreButtons[j]) && i !== j){
      genreButtons.splice(genreButtons.indexOf(genreButtons[j]),1)
    }
  }
}

  
  
  useEffect(()=>{
    setBooks(props.books)
  },[props.books])
  
const filterByGenre = (genre) => {
  setBooks(props.books.filter((b)=>{
    if(b.genres.indexOf(genre)>= 0){
      return b
    }
  }))
}







  if (!props.show) {
    return null
  }

  
  return (
    <div>
      <h2>Books</h2>
      <button onClick={()=>{console.log(genreButtons)}}>genrebuttonms</button>
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
          <h1>Filter by genre: </h1><button onClick={()=>{setBooks(props.books)}}>All</button> {genreButtons.map(genre => <button onClick={()=>{filterByGenre(genre)}}>{genre}</button>)}

    </div>
  )
}

export default Books