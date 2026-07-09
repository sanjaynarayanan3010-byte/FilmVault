import React from 'react'
import movieApplication from './movieApplication.jfif'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div className='flex space-x-10 items-center pl-4 py-3 bg-mist-100'>
        <img className='w-[50px]' src={movieApplication} alt='logo'/>
        <Link to='/' className='text-blue-400 text-3xl font-bold'>Movies</Link>
        <Link to='/watchlist' className='text-blue-400 text-3xl font-bold'>Watchlist</Link>
        <Link to='/recommendations' className='text-blue-400 text-3xl font-bold'>Recommendations</Link>
    </div>
  )
}

export default NavBar