import { useState } from 'react'
import { weatherAPI } from '../services/api'

const Weather = () => {
  const [location, setLocation] = useState('')
  const [units, setUnits] = useState('metric')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const fetchWeather = async (e) => {
    e?.preventDefault?.()
    setError('')
    setData(null)
    try {
      setLoading(true)
      const { data } = await weatherAPI.getCurrentWeather(location)
      setData(data?.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Weather & Planting Advice</h1>
        <form onSubmit={fetchWeather} className="mt-4 grid sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input className="input" placeholder="City name" value={location} onChange={(e)=>setLocation(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Fetching...' : 'Get Weather'}</button>
        </form>
        {error ? <div className="text-red-600 text-sm mt-2">{error}</div> : null}
      </div>

      {data ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-900">{data.location}</div>
          <div className="mt-2 text-sm text-gray-800">{data.description}</div>
          <div className="mt-2 text-sm text-gray-800">Temperature: {data.temperature}°</div>
          <div className="mt-1 text-sm text-gray-800">Humidity: {data.humidity}%</div>
          <div className="mt-1 text-sm text-gray-800">Wind: {data.windSpeed} m/s</div>
          <div className="mt-3 text-sm font-medium text-gray-900">Recommendations</div>
          <ul className="list-disc ml-5 mt-1 text-sm text-gray-800">
            {(data.recommendations || []).map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default Weather

