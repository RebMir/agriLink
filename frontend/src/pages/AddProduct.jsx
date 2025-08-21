import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'

const categories = ['seeds','fertilizers','pesticides','tools','machinery','crops','livestock','organic','other']
const units = ['kg','g','liters','pieces','acres','hectares','bags','tons']

const AddProduct = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    unit: '',
    quantity: '',
    minOrderQuantity: 1,
    locationCity: '',
    locationState: '',
    shippingAvailable: true,
    shippingCost: 0,
    shippingDays: 3,
    specificationsOrganic: false
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      setSubmitting(true)
      const payload = {
        name: form.name,
        category: form.category,
        subcategory: form.subcategory || undefined,
        description: form.description,
        price: Number(form.price),
        unit: form.unit,
        quantity: Number(form.quantity),
        minOrderQuantity: Number(form.minOrderQuantity) || 1,
        specifications: { organic: !!form.specificationsOrganic },
        location: { city: form.locationCity, state: form.locationState },
        shipping: { available: !!form.shippingAvailable, cost: Number(form.shippingCost) || 0, estimatedDays: Number(form.shippingDays) || 3 },
        images: imageUrl ? [{ url: imageUrl, alt: form.name, isPrimary: true }] : []
      }
      const { data } = await productAPI.createProduct(payload)
      toast.success('Product created successfully')
      const productId = data?.data?._id
      if (productId) {
        navigate(`/product/${productId}`)
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
          

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input className="input" value={form.name} onChange={(e)=>handleChange('name', e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select className="input" value={form.category} onChange={(e)=>handleChange('category', e.target.value)} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <input className="input" value={form.subcategory} onChange={(e)=>handleChange('subcategory', e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="input" rows={4} value={form.description} onChange={(e)=>handleChange('description', e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Image URL (optional)</label>
            <input className="input" placeholder="https://..." value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} />
            <p className="text-xs text-gray-500 mt-1">Direct URL for now. File uploads can be added later.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" className="input" value={form.price} onChange={(e)=>handleChange('price', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <select className="input" value={form.unit} onChange={(e)=>handleChange('unit', e.target.value)} required>
                <option value="">Select unit</option>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" className="input" value={form.quantity} onChange={(e)=>handleChange('quantity', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Order Qty</label>
              <input type="number" className="input" value={form.minOrderQuantity} onChange={(e)=>handleChange('minOrderQuantity', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input className="input" value={form.locationCity} onChange={(e)=>handleChange('locationCity', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input className="input" value={form.locationState} onChange={(e)=>handleChange('locationState', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input id="shippingAvailable" type="checkbox" checked={form.shippingAvailable} onChange={(e)=>handleChange('shippingAvailable', e.target.checked)} />
              <label htmlFor="shippingAvailable" className="text-sm text-gray-700">Shipping available</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping Cost</label>
              <input type="number" className="input" value={form.shippingCost} onChange={(e)=>handleChange('shippingCost', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Est. Days</label>
              <input type="number" className="input" value={form.shippingDays} onChange={(e)=>handleChange('shippingDays', e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Product'}</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct

