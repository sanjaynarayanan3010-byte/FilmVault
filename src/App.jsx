import NavBar from "./components/NavBar";
import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import Movies from "./components/Movies";
import WatchList from "./components/WatchList";
import Banner from "./components/Banner";
import Recommendations from "./components/Recommendations";
import { useState } from "react";

function App() {
  const [watchList, setWatchList] = useState(() => {
    const savedMovies = localStorage.getItem('movieDetails');
    return savedMovies ? JSON.parse(savedMovies) : [];
  })

  function addTOWatchList(movieObj){
    let newWatchList = [...watchList, movieObj]
    setWatchList(newWatchList)
    console.log(newWatchList)
    localStorage.setItem('movieDetails' , JSON.stringify(newWatchList))
  }

  function removeFromWatchList(movieObj){
    let filteredWatchList = watchList.filter((currWatchList) => {
      return currWatchList.id != movieObj.id
    })
    setWatchList(filteredWatchList)

    localStorage.setItem('movieDetails' , JSON.stringify(filteredWatchList))
  }

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<><Banner/><Movies watchList={watchList} addTOWatchList={addTOWatchList} removeFromWatchList={removeFromWatchList}/></>}/>
          <Route path="/watchlist" element={<WatchList watchList={watchList} removeFromWatchList={removeFromWatchList} setWatchList={setWatchList}/>}/>
          <Route path="/recommendations" element={<Recommendations watchList={watchList} addTOWatchList={addTOWatchList} removeFromWatchList={removeFromWatchList}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
