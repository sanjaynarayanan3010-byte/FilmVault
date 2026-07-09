import React, { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import axios from 'axios'
import PageChange from './PageChange'

function Movies({ watchList, addTOWatchList, removeFromWatchList }) {

  const [movies, setMovies] = useState([])
  const [currPage, setPage] = useState(1)

  useEffect(() =>{
    // Excludes Romance (10749) and Drama (18) genres for presentation safety
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=3d40638bb686b97329ad5b9d1e750c46&language=en-US&sort_by=popularity.desc&without_genres=10749,18&page=${currPage}`).then(function(res){
      setMovies(res.data.results)
    })
  }, [currPage])
  function increasePage() {
    setPage(currPage + 1)
  }

  function decreasePage() {
    if (currPage == 1) {
      setPage(1)
    }
    else setPage(currPage - 1)
  }

  return (
    <>
      <div>
        <div className='w-full text-center mt-7 mb-6 text-xl font-bold'>Trending Movies</div>
      </div>
      <div className='flex flex-wrap flex-row justify-around'>
        {movies.filter((movie) => {
          return movie.genre_ids != 10749 || movie.genre_ids != 18
        }).map((movieObj) => {
          return <MovieCard poster_path={movieObj.poster_path} name={movieObj.original_title} movieObj={movieObj} addTOWatchList={addTOWatchList} removeFromWatchList={removeFromWatchList} watchList={watchList} />
        })}
      </div>
      <PageChange currPage={currPage} increasePage={increasePage} decreasePage={decreasePage} />
    </>
  )
}

export default Movies