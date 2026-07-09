import React from 'react'

function PageChange({currPage, increasePage, decreasePage}) {
  return (
    <div className='border-b-3 bg-gray-400 mt-3 mb-3 flex justify-center p-3'>
        <button className='px-5 hover:cursor-pointer' onClick={decreasePage}><i class="fa-solid fa-angle-left"></i></button>
        <div className='font-bold'>{currPage}</div>
        <a className='px-5 hover:cursor-pointer' onClick={increasePage}><i class="fa-solid fa-angle-right"></i></a>
    </div>
  )
}

export default PageChange