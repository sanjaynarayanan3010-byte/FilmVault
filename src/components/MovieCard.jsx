import React from 'react'

function MovieCard({ poster_path, name, movieObj, addTOWatchList, removeFromWatchList, watchList }) {
  function doesContain(movieObj) {
    for (let i = 0; i < watchList.length; i++) {
      if (watchList[i].id == movieObj.id) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <div className='h-[40vh] w-[200px] flex flex-col justify-between text-center bg-center bg-cover mt-3 ml-5 mb-3 rounded-xl hover:scale-110 duration-300 hover:cursor-pointer' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${poster_path})` }}>

        {doesContain(movieObj) ?
          <div onClick={() => (removeFromWatchList(movieObj))} className='flex justify-center self-end m-4 items-center bg-gray-800/60 h-8 w-8 rounded-xl hover:scale-130 duration-300'>&#x274C;</div> : <div onClick={() => (addTOWatchList(movieObj))} className='flex justify-center self-end m-4 items-center bg-gray-800/60 h-8 w-8 rounded-xl hover:scale-130 duration-300'>😍</div>}

        <div className='text-white p-2 bg-gray-700/60 rounded-xl'>
          {name}
        </div>
      </div>

    </>
  )
}

export default MovieCard