import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import { GoogleGenerativeAI } from '@google/generative-ai'

const TMDB_API_KEY = '3d40638bb686b97329ad5b9d1e750c46'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

function Recommendations({ watchList, addTOWatchList, removeFromWatchList }) {
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiReason, setAiReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      setError('')
      setAiReason('')

      if (!watchList || watchList.length === 0) {
        try {
          const res = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          )
          setRecommendedMovies(res.data.results.slice(0, 12))
        } catch (err) {
          console.error('Error fetching popular movies:', err)
          setError('Failed to load movies. Please try again.')
        }
        setLoading(false)
        return
      }

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const watchlistTitles = watchList.map(m => m.title || m.original_title).join(', ')

        const prompt = `I have watched and liked these movies: ${watchlistTitles}.

Based on my taste — considering themes, mood, storytelling style, and genre — recommend exactly 10 movies I would enjoy. These should NOT be movies I've already listed.

Respond ONLY with a valid JSON object in this exact format, no extra text:
{
  "reason": "One sentence explaining what my taste says about me",
  "movies": ["Movie Title 1", "Movie Title 2", "Movie Title 3", "Movie Title 4", "Movie Title 5", "Movie Title 6", "Movie Title 7", "Movie Title 8", "Movie Title 9", "Movie Title 10"]
}`

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('Invalid AI response format')

        const aiData = JSON.parse(jsonMatch[0])
        setAiReason(aiData.reason || '')

        const moviePromises = aiData.movies.map(title =>
          axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(title)}&page=1`
          )
        )

        const movieResults = await Promise.all(moviePromises)

        const watchlistIds = new Set(watchList.map(m => m.id))
        const finalMovies = []
        const seenIds = new Set()

        movieResults.forEach(res => {
          if (res.data.results && res.data.results.length > 0) {
            const best = res.data.results[0]
            if (!watchlistIds.has(best.id) && !seenIds.has(best.id) && best.poster_path) {
              finalMovies.push(best)
              seenIds.add(best.id)
            }
          }
        })

        setRecommendedMovies(finalMovies)
      } catch (err) {
        console.error('AI recommendation error:', err)
        setError('AI recommendation failed. Showing genre-based picks instead.')

        try {
          const genreCounts = {}
          watchList.forEach(movie => {
            if (movie.genre_ids) {
              movie.genre_ids.forEach(id => {
                genreCounts[id] = (genreCounts[id] || 0) + 1
              })
            }
          })
          const topGenres = Object.keys(genreCounts)
            .sort((a, b) => genreCounts[b] - genreCounts[a])
            .slice(0, 2)

          const res = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${topGenres.join(',')}&page=1`
          )
          const watchlistIds = new Set(watchList.map(m => m.id))
          setRecommendedMovies(res.data.results.filter(m => !watchlistIds.has(m.id)).slice(0, 12))
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr)
        }
      }

      setLoading(false)
    }

    fetchRecommendations()
  }, [watchList])

  return (
    <div>
      <div className='w-full text-center mt-7 mb-2 text-2xl font-bold text-gray-800'>
        {watchList.length === 0 ? 'Popular Movies' : 'Recommended Movies'}
      </div>

      {watchList.length === 0 && (
        <p className='text-center text-gray-500 mb-6 text-sm'>
          Add movies to your watchlist to get personalized AI recommendations!
        </p>
      )}

      {aiReason && !loading && (
        <div className='flex justify-center mb-6'>
          <div className='bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 max-w-xl text-center'>
            <div className='text-blue-500 font-semibold text-sm'>AI's Recommendation: </div>
            <div className='text-gray-700 text-sm'>{aiReason}</div>
          </div>
        </div>
      )}

      {error && (
        <div className='flex justify-center mb-4'>
          <div className='bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-3 max-w-xl text-center'>
            <div className='text-yellow-600 text-sm'>{error}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className='flex flex-col items-center justify-center mt-20 gap-4'>
          <div class="flex items-center justify-center">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>

          <div className='text-gray-600 text-lg font-medium'>
            {watchList.length > 0 ? 'AI is analysing your taste...' : 'Loading movies...'}
          </div>
          <div className='text-gray-400 text-sm'>This may take a few seconds</div>
        </div>
      ) : (
        <div className='flex flex-wrap flex-row justify-around'>
          {recommendedMovies.length === 0 ? (
            <div className='text-center text-gray-500 mt-10'>
              No recommendations found. Try adding more movies to your watchlist!
            </div>
          ) : (
            recommendedMovies.map((movieObj) => (
              <MovieCard
                key={movieObj.id}
                poster_path={movieObj.poster_path}
                name={movieObj.original_title}
                movieObj={movieObj}
                addTOWatchList={addTOWatchList}
                removeFromWatchList={removeFromWatchList}
                watchList={watchList}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Recommendations
