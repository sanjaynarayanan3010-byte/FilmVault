import React, { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import genreIds from '../Utility/genreID'

function WatchList({ watchList, removeFromWatchList, setWatchList }) {

  const [search, setSearch] = useState('')
  const [genres, setGenres] = useState(['All Genres'])
  const [currGenre, setCurrGenre] = useState('All Genres')

  function handleSearch(e) {
    setSearch(e.target.value)
  }

  function sortIncreasing() {
    let increasingWatchlist = watchList.sort((movieA, movieB) => {
      return movieA.vote_average - movieB.vote_average
    })

    setWatchList([...increasingWatchlist])

  }

  function sortDecreasing() {
    let decreasingWatchlist = watchList.sort((movieA, movieB) => {
      return movieB.vote_average - movieA.vote_average
    })

    setWatchList([...decreasingWatchlist])

  }

  function handleFilter(genre) {
    setCurrGenre(genre)
  }

  function deleteArray() {
    localStorage.removeItem('movieDetails')
    setWatchList([])
  }

  useEffect(() => {
    let temp = watchList.map((currMovie) => {
      return genreIds[currMovie.genre_ids[0]]
    })
    temp = new Set(temp)
    setGenres(['All Genres', ...temp])

  }, [watchList])

  return (
    <>
      <div className='flex flex-row justify-center flex-wrap'>
        {genres.map((genre) => {
          return <div className='flex justify-center m-4 flex-wrap'>
            <div onClick={() => { handleFilter(genre) }} className={currGenre == genre ? 'flex justify-center items-center text-white font-bold w-[7rem] h-[2.5rem] bg-blue-400 hover:cursor-pointer rounded-xl' : 'flex justify-center items-center text-white font-bold w-[7rem] h-[2.5rem] bg-gray-400/50 hover:cursor-pointer rounded-xl'}>{genre}</div>
          </div>
        })}
        {watchList.length != 0 ? <div onClick={deleteArray} className='flex justify-center items-center text-white font-bold w-[7rem] h-[2.5rem] bg-gray-400/50 hover:cursor-pointer rounded-xl mt-4'>Clear</div> : <></>}
      </div>

      <div className='flex justify-center mt-8'>
        <input onChange={handleSearch} value={search} type='text' placeholder='Search for Movies' className='bg-gray-200 h-[2rem] w-[15rem] px-2' />
      </div>
      <div className='border border-gray-200 m-8'>
        <table className='overflow-hidden rounded-lg w-full text-center'>
          <thead className='border-b-3'>
            <tr>
              <th>Name</th>

              <div className='flex justify-center'>
                <div onClick={sortIncreasing} className='px-2 hover:cursor-pointer'><i class="fa-solid fa-angles-down"></i></div>
                <th>Ratings</th>
                <div onClick={sortDecreasing} className='px-2 hover:cursor-pointer'><i class="fa-solid fa-angles-up"></i></div>
              </div>

              <th>Popularity</th>
              <th>Genre</th>
            </tr>
          </thead>
          <tbody>

            {watchList.filter((movieObj) => {
              return (currGenre != 'All Genres' ? genreIds[movieObj.genre_ids[0]] == currGenre : movieObj)
            })
              .filter((movieObj) => {
                return movieObj.title.toLowerCase().includes(search.toLocaleLowerCase())
              }).map((movieObj) => {
                return <tr className='border-b-2'>
                  <td className='flex items-center px-6 py-4'>
                    <img className='h-[6rem] w-[10rem] object-fit' src={`https://image.tmdb.org/t/p/original/${movieObj.poster_path}`} alt="" />
                    <div className='mx-10'>{movieObj.title}</div>
                  </td>

                  <td>{movieObj.vote_average}</td>

                  <td>{movieObj.popularity}</td>

                  <td>{genreIds[movieObj.genre_ids[0]]} | {genreIds[movieObj.genre_ids[1]]}</td>

                  <td onClick={() => removeFromWatchList(movieObj)} className='text-red-700 hover:cursor-pointer'>Delete</td>
                </tr>
              })}

          </tbody>
        </table>
      </div>
    </>
  )
}

export default WatchList