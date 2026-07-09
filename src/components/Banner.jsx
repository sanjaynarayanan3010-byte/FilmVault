import React from 'react'

function Banner() {
  return (
    <div className='h-[85vh] bg-cover flex items-center items-end' style={{backgroundImage : `url(https://wallup.net/wp-content/uploads/2019/09/858592-poster-movie-film-movies-posters.jpg)`}}>
        <div className='text-center w-full bg-gray-700/60 text-white text-bold text-xl p-2'>Brave</div>
    </div>
  )
}

export default Banner