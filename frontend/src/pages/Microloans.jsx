import { useEffect, useState } from 'react'
import { loanAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Microloans = () => {
  const { isAuthenticated } = useAuth()

  const [calcForm, setCalcForm] = useState({ amount: '', term: '', interestRate: 12 })
  const [calcResult, setCalcResult] = useState(null)
  const [calcError, setCalcError] = useState('')
  const [calcLoading, setCalcLoading] = useState(false)

  const [applyForm, setApplyForm] = useState({
    loanType: 'crop_loan', amount: '', purpose: '', term: 12,
    farmDetails: { farmSize: '', currentCrops: [] }, collateral: 'none', collateralValue: '', guarantorName: ''
  })
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState('')

  const [loans, setLoans] = useState([])
  const [loansLoading, setLoansLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) fetchLoans()
  }, [isAuthenticated])

  const fetchLoans = async () => {
    try {
      setLoansLoading(true)
      const { data } = await loanAPI.getUserLoans()
      setLoans(data?.data || [])
    } catch (e) {
      // ignore
    } finally {
      setLoansLoading(false)
    }
  }

  const calculate = async (e) => {
    e.preventDefault()
    setCalcError('')
    setCalcResult(null)
    try {
      setCalcLoading(true)
      const payload = {
        amount: Number(calcForm.amount),
        term: Number(calcForm.term),
        interestRate: Number(calcForm.interestRate)
      }
      const { data } = await loanAPI.calculateLoan(payload)
      setCalcResult(data?.data)
    } catch (e) {
      setCalcError(e?.response?.data?.error || 'Failed to calculate loan')
    } finally {
      setCalcLoading(false)
    }
  }

  const apply = async (e) => {
    e.preventDefault()
    setApplyError('')
    setApplySuccess('')
    try {
      setApplyLoading(true)
      const payload = {
        loanType: applyForm.loanType,
        amount: Number(applyForm.amount),
        purpose: applyForm.purpose,
        term: Number(applyForm.term),
        farmDetails: { farmSize: Number(applyForm.farmDetails.farmSize || 0), currentCrops: applyForm.farmDetails.currentCrops },
        collateral: applyForm.collateral,
        collateralValue: applyForm.collateral === 'none' ? undefined : Number(applyForm.collateralValue || 0),
        guarantor: applyForm.guarantorName ? { name: applyForm.guarantorName } : undefined
      }
      await loanAPI.applyForLoan(payload)
      setApplySuccess('Loan application submitted')
      fetchLoans()
    } catch (e) {
      setApplyError(e?.response?.data?.error || 'Failed to submit application')
    } finally {
      setApplyLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Microloans</h1>
        <form onSubmit={calculate} className="mt-4 grid sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" className="input" value={calcForm.amount} onChange={(e)=>setCalcForm(f=>({...f, amount:e.target.value}))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Term (months)</label>
            <input type="number" className="input" value={calcForm.term} onChange={(e)=>setCalcForm(f=>({...f, term:e.target.value}))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest % (APR)</label>
            <input type="number" className="input" value={calcForm.interestRate} onChange={(e)=>setCalcForm(f=>({...f, interestRate:e.target.value}))} required />
          </div>
          <button type="submit" className="btn-primary" disabled={calcLoading}>{calcLoading ? 'Calculating...' : 'Calculate'}</button>
        </form>
        {calcError ? <div className="text-red-600 text-sm mt-2">{calcError}</div> : null}
        {calcResult ? (
          <div className="mt-4 text-sm text-gray-800">
            <div>Monthly Payment: Kshs. {calcResult.monthlyPayment?.toFixed?.(2)}</div>
            <div>Total Amount: Kshs. {calcResult.totalAmount?.toFixed?.(2)}</div>
            <div>Total Interest: Kshs. {calcResult.totalInterest?.toFixed?.(2)}</div>
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900">Apply for a loan</h2>
        {!isAuthenticated ? (
          <div className="text-sm text-gray-700 mt-2">Please log in to apply.</div>
        ) : (
          <form onSubmit={apply} className="mt-4 space-y-3">
            {applyError ? <div className="text-red-600 text-sm">{applyError}</div> : null}
            {applySuccess ? <div className="text-green-600 text-sm">{applySuccess}</div> : null}

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select className="input" value={applyForm.loanType} onChange={(e)=>setApplyForm(f=>({...f, loanType:e.target.value}))}>
                  <option value="crop_loan">Crop</option>
                  <option value="equipment_loan">Equipment</option>
                  <option value="infrastructure_loan">Infrastructure</option>
                  <option value="livestock_loan">Livestock</option>
                  <option value="organic_farming_loan">Organic</option>
                  <option value="emergency_loan">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" className="input" value={applyForm.amount} onChange={(e)=>setApplyForm(f=>({...f, amount:e.target.value}))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Term (months)</label>
                <input type="number" className="input" value={applyForm.term} onChange={(e)=>setApplyForm(f=>({...f, term:e.target.value}))} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <textarea className="input" rows={3} value={applyForm.purpose} onChange={(e)=>setApplyForm(f=>({...f, purpose:e.target.value}))} required />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Farm Size (acres)</label>
                <input type="number" className="input" value={applyForm.farmDetails.farmSize} onChange={(e)=>setApplyForm(f=>({...f, farmDetails:{...f.farmDetails, farmSize:e.target.value}}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Collateral</label>
                <select className="input" value={applyForm.collateral} onChange={(e)=>setApplyForm(f=>({...f, collateral:e.target.value}))}>
                  <option value="none">None</option>
                  <option value="land">Land</option>
                  <option value="equipment">Equipment</option>
                  <option value="livestock">Livestock</option>
                  <option value="crops">Crops</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {applyForm.collateral !== 'none' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Collateral Value</label>
                  <input type="number" className="input" value={applyForm.collateralValue} onChange={(e)=>setApplyForm(f=>({...f, collateralValue:e.target.value}))} />
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Guarantor Name (optional)</label>
              <input className="input" value={applyForm.guarantorName} onChange={(e)=>setApplyForm(f=>({...f, guarantorName:e.target.value}))} />
            </div>

            <button type="submit" className="btn-primary" disabled={applyLoading}>{applyLoading ? 'Submitting...' : 'Submit Application'}</button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900">My Loans</h2>
        {!isAuthenticated ? (
          <div className="text-sm text-gray-700 mt-2">Please log in to view your loans.</div>
        ) : loansLoading ? (
          <div className="text-sm text-gray-700 mt-2">Loading...</div>
        ) : (
          <div className="mt-3 space-y-3">
            {loans.length === 0 ? (
              <div className="text-sm text-gray-600">No loans yet.</div>
            ) : (
              loans.map((loan) => (
                <div key={loan._id} className="border border-gray-200 rounded p-3 text-sm">
                  <div className="font-medium">{loan.loanType.replaceAll('_',' ')}</div>
                  <div>Amount: Kshs. {loan.amount} • Term: {loan.term} months • Rate: {loan.interestRate}%</div>
                  <div>Status: {loan.status}</div>
                  <div>Monthly: Kshs. {loan.monthlyPayment?.toFixed?.(2)} • Total: Kshs. {loan.totalAmount?.toFixed?.(2)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Microloans

