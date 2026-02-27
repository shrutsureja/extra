import { useEffect, useState } from 'react'

type IconProps = {
  size?: number
  className?: string
}

const IconCalculator = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
)

const IconArrowRightLeft = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
)

const IconCopy = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const IconCheck = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const IconClock = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconBarChart2 = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>
)

const IconHash = ({ size = 24, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="9" y2="9" />
    <line x1="4" x2="20" y1="15" y2="15" />
    <line x1="10" x2="8" y1="3" y2="21" />
    <line x1="16" x2="14" y1="3" y2="21" />
  </svg>
)

const RATES = {
  Low: 0.125,
  Medium: 0.156,
  High: 0.195,
  Advanced: 0.244,
} as const

type ComplexityLevel = keyof typeof RATES

type DetectedComplexity = {
  level: ComplexityLevel
  exactRate: number
  calculatedRate: number
  isExact: boolean
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculate' | 'reverse'>('calculate')

  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')

  const [complexity, setComplexity] = useState<ComplexityLevel>('Medium')
  const [calculatedPoints, setCalculatedPoints] = useState('0.00')

  const [assignedPoints, setAssignedPoints] = useState('')
  const [detectedComplexity, setDetectedComplexity] = useState<DetectedComplexity | null>(null)

  const [copied, setCopied] = useState(false)

  const getTotalMinutes = () => {
    const h = parseInt(hours || '0', 10)
    const m = parseInt(minutes || '0', 10)
    return h * 60 + m
  }

  useEffect(() => {
    const totalMins = getTotalMinutes()
    if (totalMins > 0 && activeTab === 'calculate') {
      const unitsOf30 = totalMins / 30
      const points = unitsOf30 * RATES[complexity]
      setCalculatedPoints(parseFloat(points.toFixed(4)).toString())
    } else {
      setCalculatedPoints('0')
    }
  }, [hours, minutes, complexity, activeTab])

  useEffect(() => {
    const totalMins = getTotalMinutes()
    const points = parseFloat(assignedPoints || '0')

    if (totalMins > 0 && points > 0 && activeTab === 'reverse') {
      const unitsOf30 = totalMins / 30
      const ratePer30 = points / unitsOf30
      const roundedRatePer30 = parseFloat(ratePer30.toFixed(4))

      let closestMatch: DetectedComplexity | null = null
      let minDiff = Infinity

      for (const [level, rate] of Object.entries(RATES)) {
        const diff = Math.abs(rate - roundedRatePer30)
        if (diff < minDiff) {
          minDiff = diff
          closestMatch = {
            level: level as ComplexityLevel,
            exactRate: rate,
            calculatedRate: roundedRatePer30,
            isExact: diff < 0.000001,
          }
        }
      }
      setDetectedComplexity(closestMatch)
    } else {
      setDetectedComplexity(null)
    }
  }, [hours, minutes, assignedPoints, activeTab])

  const handleCopy = () => {
    const textToCopy = calculatedPoints

    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed', error)
    } finally {
      textArea.remove()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <IconCalculator size={28} />
            Story Point Tools
          </h1>
          <p className="text-indigo-200 text-sm mt-1">Calculate or evaluate task complexity</p>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('calculate')}
            className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'calculate'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <IconCalculator size={18} />
            Find Points
          </button>
          <button
            onClick={() => setActiveTab('reverse')}
            className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'reverse'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <IconArrowRightLeft size={18} />
            Find Level
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <IconClock size={16} className="text-indigo-500" />
              Time Estimated/Spent
            </label>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                  hrs
                </span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                  mins
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {activeTab === 'calculate' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <IconBarChart2 size={16} className="text-indigo-500" />
                  Task Complexity
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(RATES) as ComplexityLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setComplexity(level)}
                      className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        complexity === level
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm font-medium">{level}</span>
                      <span className={`text-xs ${complexity === level ? 'text-indigo-500' : 'text-slate-400'}`}>
                        {RATES[level]} pts/30m
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-indigo-100 mt-4">
                <p className="text-indigo-600/80 text-sm font-semibold mb-1 uppercase tracking-wider">
                  Total Story Points
                </p>
                <div className="text-4xl font-bold text-indigo-900 mb-4 tracking-tight">{calculatedPoints}</div>

                <button
                  onClick={handleCopy}
                  disabled={calculatedPoints === '0'}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                    calculatedPoints === '0'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : copied
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95'
                  }`}
                >
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reverse' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <IconHash size={16} className="text-indigo-500" />
                  Assigned Story Points
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={assignedPoints}
                    onChange={(event) => setAssignedPoints(event.target.value)}
                    className="w-full pl-4 pr-10 py-3 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="e.g. 2.5"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconCalculator size={20} />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  detectedComplexity
                    ? 'bg-indigo-50 border-indigo-100'
                    : 'bg-slate-50 border-slate-100 border-dashed text-center'
                }`}
              >
                {!detectedComplexity ? (
                  <p className="text-slate-400 text-sm">Enter time and points to reveal the complexity level.</p>
                ) : (
                  <div className="text-center space-y-2">
                    <p className="text-indigo-600/80 text-sm font-semibold uppercase tracking-wider">Detected Level</p>
                    <div className="text-3xl font-bold text-indigo-900">
                      {!detectedComplexity.isExact
                        ? `Averaged - ${detectedComplexity.calculatedRate}`
                        : detectedComplexity.level}
                    </div>
                    <p className="text-slate-500 text-sm mt-2">
                      {!detectedComplexity.isExact ? 'Closest level match: ' : 'Base rate matched: '}
                      <span className="font-semibold text-slate-700">{detectedComplexity.level}</span> (
                      {RATES[detectedComplexity.level]} pts / 30m)
                    </p>
                    {!detectedComplexity.isExact && (
                      <p className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full mt-2 border border-amber-200">
                        * Note: Points were averaged or rounded
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
