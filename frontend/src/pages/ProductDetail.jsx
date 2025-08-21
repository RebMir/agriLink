import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [togglingFavorite, setTogglingFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getProduct(id)
        setProduct(data?.data)
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      setTogglingFavorite(true)
      await productAPI.toggleFavorite(id)
      const { data } = await productAPI.getProduct(id)
      setProduct(data?.data)
      toast.success('Updated favorites')
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not toggle favorite')
    } finally {
      setTogglingFavorite(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      setSubmittingReview(true)
      await productAPI.addReview(id, reviewForm)
      setReviewForm({ rating: 5, comment: '' })
      const { data } = await productAPI.getProduct(id)
      setProduct(data?.data)
      toast.success('Review submitted')
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="animate-pulse">Loading product...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 text-red-600">{error}</div>
    )
  }

  if (!product) return null

  const favoriteCount = Array.isArray(product.favorites) ? product.favorites.length : 0
  const reviews = product?.rating?.reviews || []

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="text-gray-600 mt-1">
              <span className="capitalize">{product.category}</span>
              {product.subcategory ? <span> • {product.subcategory}</span> : null}
            </div>
            <div className="mt-3 text-xl font-semibold text-gray-900">
              Kshs. {product.price} <span className="text-sm font-normal text-gray-600">/ {product.unit}</span>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              Available: {product.quantity} {product.unit}
            </div>
            <div className="mt-2 text-sm text-gray-700">
              Min order: {product.minOrderQuantity}
            </div>
            <div className="mt-2 text-sm text-gray-700">
              Location: {product?.location?.city}, {product?.location?.state}
            </div>
            <div className="mt-2 text-sm text-gray-700">
              Rating: {product?.rating?.average?.toFixed?.(1) || 0} ({product?.rating?.count || 0})
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={handleToggleFavorite}
              disabled={togglingFavorite}
              className="btn-primary"
            >
              {togglingFavorite ? 'Updating...' : `Favorite (${favoriteCount})`}
            </button>
          </div>
        </div>
        <p className="mt-6 text-gray-800 leading-relaxed">{product.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900">Shipping</h2>
        <div className="mt-2 text-sm text-gray-700">
          {product?.shipping?.available ? (
            <div>
              <div>Available • Estimated {product?.shipping?.estimatedDays} days</div>
              <div>Cost: Kshs. {product?.shipping?.cost || 0}</div>
            </div>
          ) : (
            <div>Not available</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
        <div className="mt-4 space-y-4">
          {reviews.length === 0 && (
            <div className="text-sm text-gray-600">No reviews yet.</div>
          )}
          {reviews.map((r) => (
            <div key={r._id || r.createdAt} className="border border-gray-200 rounded p-3">
              <div className="text-sm text-gray-900 font-medium">Rating: {r.rating} / 5</div>
              {r.comment ? (
                <div className="text-sm text-gray-700 mt-1">{r.comment}</div>
              ) : null}
              <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-900">Add a review</h3>
          <form onSubmit={handleSubmitReview} className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[1,2,3,4,5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Share your experience"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              />
            </div>
            <div>
              <button type="submit" className="btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

