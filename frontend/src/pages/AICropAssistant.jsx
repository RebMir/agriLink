import { useState } from 'react'
import { aiAPI } from '../services/api'

const AICropAssistant = () => {
  const [activeTool, setActiveTool] = useState('crop')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const [cropForm, setCropForm] = useState({
    location: '', soilType: '', season: '', farmSize: '', waterAvailability: '', budget: '', experience: '', previousCrops: ''
  })
  const [plantForm, setPlantForm] = useState({
    crop: '', location: '', soilType: '', season: '', weatherConditions: '', farmSize: '', irrigationType: ''
  })
  const [pestForm, setPestForm] = useState({
    crop: '', symptoms: '', affectedArea: '', weatherConditions: '', stage: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult('')
    try {
      setLoading(true)
      if (activeTool === 'crop') {
        const { data } = await aiAPI.getCropRecommendation({ ...cropForm, farmSize: Number(cropForm.farmSize || 0), budget: Number(cropForm.budget || 0), experience: Number(cropForm.experience || 0) })
        setResult(data?.data?.recommendation || '')
      } else if (activeTool === 'plant') {
        const { data } = await aiAPI.getPlantingAdvice({ ...plantForm, farmSize: Number(plantForm.farmSize || 0) })
        setResult(data?.data?.advice || '')
      } else {
        const { data } = await aiAPI.getPestDiagnosis({ ...pestForm })
        setResult(data?.data?.diagnosis || '')
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to get AI response')
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => {
    if (activeTool === 'crop') {
      return (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Location" value={cropForm.location} onChange={(e)=>setCropForm(f=>({...f, location:e.target.value}))} />
            <input className="input" placeholder="Soil Type" value={cropForm.soilType} onChange={(e)=>setCropForm(f=>({...f, soilType:e.target.value}))} />
            <input className="input" placeholder="Season" value={cropForm.season} onChange={(e)=>setCropForm(f=>({...f, season:e.target.value}))} />
            <input className="input" placeholder="Farm Size (acres)" value={cropForm.farmSize} onChange={(e)=>setCropForm(f=>({...f, farmSize:e.target.value}))} />
            <input className="input" placeholder="Water Availability" value={cropForm.waterAvailability} onChange={(e)=>setCropForm(f=>({...f, waterAvailability:e.target.value}))} />
            <input className="input" placeholder="Budget" value={cropForm.budget} onChange={(e)=>setCropForm(f=>({...f, budget:e.target.value}))} />
            <input className="input" placeholder="Experience (years)" value={cropForm.experience} onChange={(e)=>setCropForm(f=>({...f, experience:e.target.value}))} />
            <input className="input" placeholder="Previous Crops (optional)" value={cropForm.previousCrops} onChange={(e)=>setCropForm(f=>({...f, previousCrops:e.target.value}))} />
          </div>
        </div>
      )
    }
    if (activeTool === 'plant') {
      return (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Crop" value={plantForm.crop} onChange={(e)=>setPlantForm(f=>({...f, crop:e.target.value}))} />
            <input className="input" placeholder="Location" value={plantForm.location} onChange={(e)=>setPlantForm(f=>({...f, location:e.target.value}))} />
            <input className="input" placeholder="Soil Type" value={plantForm.soilType} onChange={(e)=>setPlantForm(f=>({...f, soilType:e.target.value}))} />
            <input className="input" placeholder="Season" value={plantForm.season} onChange={(e)=>setPlantForm(f=>({...f, season:e.target.value}))} />
            <input className="input" placeholder="Weather Conditions" value={plantForm.weatherConditions} onChange={(e)=>setPlantForm(f=>({...f, weatherConditions:e.target.value}))} />
            <input className="input" placeholder="Farm Size (acres)" value={plantForm.farmSize} onChange={(e)=>setPlantForm(f=>({...f, farmSize:e.target.value}))} />
            <input className="input" placeholder="Irrigation Type" value={plantForm.irrigationType} onChange={(e)=>setPlantForm(f=>({...f, irrigationType:e.target.value}))} />
          </div>
        </div>
      )
    }
    return (
      <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Crop" value={pestForm.crop} onChange={(e)=>setPestForm(f=>({...f, crop:e.target.value}))} />
          <input className="input" placeholder="Symptoms" value={pestForm.symptoms} onChange={(e)=>setPestForm(f=>({...f, symptoms:e.target.value}))} />
          <input className="input" placeholder="Affected Area" value={pestForm.affectedArea} onChange={(e)=>setPestForm(f=>({...f, affectedArea:e.target.value}))} />
          <input className="input" placeholder="Weather Conditions" value={pestForm.weatherConditions} onChange={(e)=>setPestForm(f=>({...f, weatherConditions:e.target.value}))} />
          <input className="input" placeholder="Growth Stage" value={pestForm.stage} onChange={(e)=>setPestForm(f=>({...f, stage:e.target.value}))} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Crop Assistant</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className={`btn-secondary ${activeTool==='crop' ? 'ring-2 ring-primary-500' : ''}`} onClick={()=>setActiveTool('crop')}>Crop Recommendation</button>
          <button className={`btn-secondary ${activeTool==='plant' ? 'ring-2 ring-primary-500' : ''}`} onClick={()=>setActiveTool('plant')}>Planting Advice</button>
          <button className={`btn-secondary ${activeTool==='pest' ? 'ring-2 ring-primary-500' : ''}`} onClick={()=>setActiveTool('pest')}>Pest Diagnosis</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
          {renderForm()}
          <div>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Asking AI...' : 'Get Advice'}</button>
          </div>
        </form>
      </div>

      {result ? (
        <div className="bg-white rounded-lg shadow p-6 whitespace-pre-wrap">
          <h2 className="text-lg font-semibold text-gray-900">Result</h2>
          <div className="mt-3 text-gray-800">{result}</div>
        </div>
      ) : null}
    </div>
  )
}

export default AICropAssistant

