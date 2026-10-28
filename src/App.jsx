
import { useState } from 'react'
import {
  Leaf,
  LayoutDashboard,
  ClipboardCheck,
  Laptop,
  MapPin,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Recycle,
  ArrowUpRight,
  Smartphone,
  Wrench,
  X,
  History,
  Eye,
  Inbox,
  Activity,
  ScanSearch,
  ClipboardList,
  GitCompare,
} from 'lucide-react'

import AssessmentResult from './components/AssessmentResult'
import PhotoUploader from './components/PhotoUploader'
import { analyzeDevicePhoto } from './utils/aiService'
import AssessmentHistory from './components/AssessmentHistory'

import {
  calculateHealth,
  getRecommendation,
  getAssessmentFactors,
} from './utils/assessment'

import {
  getAssessmentHistory,
  addAssessmentToHistory,
} from './utils/history'

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Assess Device', icon: ClipboardCheck },
  { label: 'My Devices', icon: Laptop },
  { label: 'Refurbishment Centers', icon: MapPin },
  { label: 'Sustainability Dashboard', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
]

const pageTitles = {
  Overview: 'Overview',
  'Assess Device': 'Assess Your Device',
  'My Devices': 'My Devices',
  'Refurbishment Centers': 'Refurbishment Centers',
  'Sustainability Dashboard': 'Sustainability Dashboard',
  Settings: 'Settings',
}

function Sidebar({ activePage, setActivePage, open, close, historyCount }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={close}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-white">
              <Leaf size={25} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Eco<span className="text-emerald-700">Revive</span>
              </h1>
              <p className="text-xs text-gray-500">Give tech a second life</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => {
                  setActivePage(label)
                  close()
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activePage === label
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={19} />
                <span className="flex-1">{label}</span>

                {label === 'My Devices' && historyCount > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                    {historyCount}
                  </span>
                )}

                {activePage === label && (
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700">
              <Recycle size={22} />
            </div>
            <p className="font-semibold text-gray-800">Small steps matter.</p>
            <p className="mt-1 text-sm leading-5 text-gray-600">
              Every device deserves a second chance.
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full w-3/4 rounded-full bg-emerald-700" />
            </div>
            <p className="mt-2 text-xs text-gray-500">Demo workspace</p>
          </div>
        </div>
      </aside>
    </>
  )
}

function Navbar({ activePage, setOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-gray-900">{activePage}</h2>
          <p className="hidden text-xs text-gray-500 sm:block">
            Welcome to your sustainable tech workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Search"
          onClick={() => window.alert('Search will be implemented in a future update.')}
          className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100"
        >
          <Search size={20} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => window.alert('You have no new notifications.')}
          className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-100 pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
            S
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Student</p>
            <p className="text-xs text-gray-500">Demo account</p>
          </div>
          <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </div>
      </div>
    </header>
  )
}

function SummaryCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
        <ArrowUpRight size={15} className="text-emerald-700" />
        {description}
      </div>
    </div>
  )
}

function AssessmentForm({ onAssessmentComplete }) {
  const [assessmentMode, setAssessmentMode] = useState('compare')
  const [deviceType, setDeviceType] = useState('Laptop')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [storage, setStorage] = useState('')
  const [ram, setRam] = useState('Not specified')
  const [battery, setBattery] = useState('Good')
  const [screen, setScreen] = useState('Excellent')
  const [buttons, setButtons] = useState('Working')
  const [performance, setPerformance] = useState('Normal')
  const [damage, setDamage] = useState('None')
  const [functional, setFunctional] = useState('Fully Working')
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fieldClass =
    'mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

  const labelClass = 'text-sm font-medium text-gray-700'

  function SelectField({ label, value, onChange, options, required = false }) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        <select
          required={required}
          className={fieldClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option || 'empty'} value={option}>
              {option || 'Select an option'}
            </option>
          ))}
        </select>
      </label>
    )
  }

  function resetForm() {
    setAssessmentMode('compare')
    setDeviceType('Laptop')
    setBrand('')
    setModel('')
    setYear('')
    setStorage('')
    setRam('Not specified')
    setBattery('Good')
    setScreen('Excellent')
    setButtons('Working')
    setPerformance('Normal')
    setDamage('None')
    setFunctional('Fully Working')
    setPhotos([])
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!brand || !model.trim() || !year || !storage) {
      setError('Please complete all required fields.')
      return
    }

    const purchaseYear = Number(year)
    const currentYear = new Date().getFullYear()

    if (
      !Number.isInteger(purchaseYear) ||
      purchaseYear < 1990 ||
      purchaseYear > currentYear
    ) {
      setError(`Enter a purchase year between 1990 and ${currentYear}.`)
      return
    }

    if (assessmentMode !== 'ai' && (!battery || !screen || !buttons || !performance || !damage || !functional)) {
      setError('Please complete the manual condition fields, or choose AI photo assessment.');
      return;
    }

    if (assessmentMode !== 'manual' && photos.length === 0) {
      setError('Please upload at least one photo for AI photo assessment.');
      return;
    }

    setLoading(true)

    try {
      const device = {
        type: deviceType,
        deviceType,
        brand,
        model: model.trim(),
        year: purchaseYear,
        storage,
        ram,
        battery,
        screen,
        buttons,
        performance,
        damage,
        functional,
      }

      const result = calculateHealth(device)
      const recommendation = getRecommendation(device, result.score)
      const factors = getAssessmentFactors(device)

      // Only run the image model in AI-only or comparison mode.
      let aiAnalysis = null
      if (assessmentMode !== 'manual' && photos.length > 0) {
        try {
          aiAnalysis = await analyzeDevicePhoto(photos[0])
        } catch (aiError) {
          aiAnalysis = {
            error: aiError instanceof Error
              ? aiError.message
              : 'AI image analysis could not be completed.',
          }
        }
      }

      const completedAssessment = {
        id: crypto.randomUUID(),
        device,
        result,
        recommendation,
        factors,
        aiAnalysis,
        assessmentMode,
        photos: photos.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        assessedAt: new Date().toISOString(),
      }

      onAssessmentComplete(completedAssessment)
    } catch (err) {
      console.error('Assessment failed:', err)
      setError('The assessment could not be completed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
            <Laptop size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Basic information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tell us a little about your device.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Device type *"
            value={deviceType}
            onChange={setDeviceType}
            options={['Laptop', 'Smartphone', 'Tablet', 'Desktop', 'Other']}
            required
          />

          <SelectField
            label="Brand *"
            value={brand}
            onChange={setBrand}
            options={[
              '',
              'Dell',
              'HP',
              'Lenovo',
              'Apple',
              'Samsung',
              'Asus',
              'Acer',
              'Other',
            ]}
            required
          />

          <label className="block">
            <span className={labelClass}>Model name *</span>
            <input
              required
              className={fieldClass}
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder="e.g. Inspiron 15"
            />
          </label>

          <label className="block">
            <span className={labelClass}>Purchase year *</span>
            <input
              required
              className={fieldClass}
              type="number"
              min="1990"
              max={new Date().getFullYear()}
              value={year}
              onChange={(event) => setYear(event.target.value)}
              placeholder="e.g. 2022"
            />
          </label>

          {['Laptop', 'Desktop'].includes(deviceType) && (
            <SelectField
              label="RAM"
              value={ram}
              onChange={setRam}
              options={[
                'Not specified',
                '4 GB',
                '8 GB',
                '16 GB',
                '32 GB',
                '64 GB',
              ]}
            />
          )}

          <SelectField
            label="Storage capacity *"
            value={storage}
            onChange={setStorage}
            options={[
              '',
              '64 GB',
              '128 GB',
              '256 GB',
              '512 GB',
              '1 TB',
              '2 TB or more',
            ]}
            required
          />
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="font-bold text-gray-900">Choose assessment method</h3>
        <p className="mt-1 text-sm leading-6 text-gray-500">Choose whether to use your own condition details, AI photo analysis, or compare both.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { value: 'manual', title: 'Manual assessment', description: 'Use the condition details you enter.', Icon: ClipboardList },
            { value: 'ai', title: 'AI photo assessment', description: 'Use a device photo; condition fields are not required.', Icon: ScanSearch },
            { value: 'compare', title: 'Compare both', description: 'Show manual details and AI predictions side by side.', Icon: GitCompare },
          ].map(({ value, title, description, Icon }) => (
            <button key={value} type="button" onClick={() => setAssessmentMode(value)} className={`rounded-xl border p-4 text-left transition ${assessmentMode === value ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100' : 'border-gray-200 hover:border-emerald-300'}`} aria-pressed={assessmentMode === value}>
              <Icon size={22} className={assessmentMode === value ? 'text-emerald-800' : 'text-gray-500'} />
              <p className="mt-3 font-semibold text-gray-900">{title}</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">{description}</p>
            </button>
          ))}
        </div>
      </section>

      {assessmentMode !== 'ai' && (
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
            <Wrench size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Device condition</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose the options that best describe your device.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Battery *"
            value={battery}
            onChange={setBattery}
            options={['Excellent', 'Good', 'Weak', 'Damaged']}
            required
          />
          <SelectField
            label="Display / Screen *"
            value={screen}
            onChange={setScreen}
            options={['Excellent', 'Good', 'Cracked', 'Not Working']}
            required
          />
          <SelectField
            label="Keyboard / Buttons *"
            value={buttons}
            onChange={setButtons}
            options={[
              'Working',
              'Partially Working',
              'Not Working',
              'Not Applicable',
            ]}
            required
          />
          <SelectField
            label="Performance *"
            value={performance}
            onChange={setPerformance}
            options={['Fast', 'Normal', 'Slow', 'Not Working']}
            required
          />
          <SelectField
            label="Physical damage *"
            value={damage}
            onChange={setDamage}
            options={['None', 'Minor', 'Moderate', 'Severe']}
            required
          />
          <SelectField
            label="Functional status *"
            value={functional}
            onChange={setFunctional}
            options={['Fully Working', 'Partially Working', 'Not Working']}
            required
          />
        </div>

        {battery === 'Damaged' && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <strong>Battery safety warning:</strong> Do not charge, puncture,
            or attempt DIY repair on a potentially damaged battery. Seek
            qualified service or authorized e-waste handling.
          </div>
        )}
      </section>
      )}

      {assessmentMode !== 'manual' && (
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-sky-50 p-3 text-sky-700">
            <Smartphone size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Device photos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add photos from different angles to document physical condition.
            </p>
          </div>
        </div>

        <PhotoUploader onPhotosChange={setPhotos} />
        <p className="mt-3 text-xs leading-5 text-gray-500">
          The first uploaded photo will be sent to the local EcoRevive AI
          service for experimental image classification. Keep the Python
          service running while assessing a device.
        </p>
      </section>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={resetForm}
          disabled={loading}
          className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Reset form
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Assessing device...
            </span>
          ) : (
            assessmentMode === 'manual' ? 'Assess Manually →' : assessmentMode === 'ai' ? 'Analyze Photo →' : 'Compare Both →'
          )}
        </button>
      </div>
    </form>
  )
}

function Overview({ history, onAssess, onView }) {
  const total = history.length

  const averageHealth = total
    ? Math.round(
        history.reduce(
          (sum, item) => sum + (Number(item.result?.score) || 0),
          0,
        ) / total,
      )
    : 0

  const suitableForReuse = history.filter(
    (item) => Number(item.result?.score) >= 70,
  ).length

  const requiringRepair = history.filter((item) =>
    /repair|refurbish/i.test(item.recommendation?.action || ''),
  ).length

  return (
    <>
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <Leaf size={14} />
          SMARTER TECH. GREENER FUTURE.
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Welcome to EcoRevive
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Give your old electronics a second life. Discover the smartest way
          to reuse, repair, or recycle your device.
        </p>
        <button
          type="button"
          onClick={onAssess}
          className="mt-5 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          Assess a device →
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Devices Assessed"
          value={total}
          description="Saved assessments"
          icon={Laptop}
          color="bg-emerald-50 text-emerald-800"
        />
        <SummaryCard
          title="Average Device Health"
          value={`${averageHealth}/100`}
          description={total ? 'Average of assessed devices' : 'No assessments yet'}
          icon={BarChart3}
          color="bg-sky-50 text-sky-700"
        />
        <SummaryCard
          title="Suitable for Reuse"
          value={suitableForReuse}
          description="Devices scoring 70 or higher"
          icon={Recycle}
          color="bg-teal-50 text-teal-700"
        />
        <SummaryCard
          title="Requiring Repair"
          value={requiringRepair}
          description="Repair/refurbishment recommendations"
          icon={Wrench}
          color="bg-amber-50 text-amber-700"
        />
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent assessments</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest devices and their assessment results.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onView(null)}
            className="text-left text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            View all devices →
          </button>
        </div>

        {history.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center">
            <Inbox size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 font-semibold text-gray-800">No devices assessed yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Complete your first assessment to see your dashboard statistics.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.device?.brand} {item.device?.model}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.device?.type || item.device?.deviceType} ·{' '}
                    {new Date(item.assessedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-sm font-semibold text-emerald-800">
                    {item.result?.score ?? 0}/100
                  </span>
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    className="text-sm font-semibold text-gray-600 hover:text-emerald-800"
                  >
                    View results
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function RefurbishmentCenters({ onBack }) {
  const [status, setStatus] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  function openNearbyCenters() {
    setStatus('')

    if (!navigator.geolocation) {
      setStatus(
        'Location is not supported by your browser. Please use manual search.'
      )
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const query = encodeURIComponent(
          'electronics repair and refurbishment centers'
        )
        const url = `https://www.google.com/maps/search/${query}/@${latitude},${longitude},13z`

        window.open(url, '_blank', 'noopener,noreferrer')
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)

        if (error.code === error.PERMISSION_DENIED) {
          setStatus(
            'Location permission was denied. Allow location access in your browser, or use the manual search below.'
          )
        } else if (error.code === error.TIMEOUT) {
          setStatus(
            'Location lookup timed out. Please try again or search manually.'
          )
        } else {
          setStatus(
            'Could not get your location. Please try again or search manually.'
          )
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  function searchWithoutLocation() {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=electronics+repair+and+refurbishment+centers',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-emerald-900 p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/10 p-3">
            <MapPin size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-100">
              REPAIR · REFURBISH · RECYCLE
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Refurbishment Centers
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
              Find nearby electronics repair shops, refurbishment services,
              and e-waste recycling centers using Google Maps.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openNearbyCenters}
          disabled={isLocating}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-60"
        >
          <MapPin size={18} />
          {isLocating ? 'Finding your location...' : 'Use my location'}
        </button>
      </section>

      {status && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
        >
          {status}
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
            <Search size={23} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              Explore repair centers
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Search for nearby repair shops, device refurbishment services,
              and electronics recycling locations. View available places,
              ratings, and directions on Google Maps.
            </p>
            <button
              type="button"
              onClick={searchWithoutLocation}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Search on Google Maps
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-50 p-3 text-sky-700">
            <Activity size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">How it works</h2>
            <p className="mt-1 text-sm text-gray-500">
              No Google Maps API key or payment verification required.
            </p>
          </div>
        </div>
        <ol className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
          <li>1. Click Use my location and allow browser permission.</li>
          <li>2. Google Maps opens around your current coordinates.</li>
          <li>3. Choose a center to view its details and directions.</li>
        </ol>
        <p className="mt-4 text-xs leading-5 text-gray-400">
          EcoRevive accesses your location only after you click the location
          button and does not save your coordinates.
        </p>
      </section>

      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        Back to Overview
      </button>
    </div>
  )
}

function PlaceholderPage({ title, onBack }) {
  const descriptions = {
    'Sustainability Dashboard':
      'Track verified reuse and recycling outcomes, estimated waste diverted, and environmental impact as these measurements are implemented.',
    Settings:
      'Account preferences and application settings will be added in a future iteration.',
  }

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="mb-5 rounded-2xl bg-emerald-50 p-5 text-emerald-800">
        <Leaf size={36} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
        {descriptions[title]}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
      >
        Back to Overview
      </button>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [history, setHistory] = useState(() => getAssessmentHistory())
  const [storageWarning, setStorageWarning] = useState('')

  function handleAssessmentComplete(newAssessment) {
    const { history: updatedHistory, saved } =
      addAssessmentToHistory(newAssessment)

    setHistory(updatedHistory)
    setAssessment(newAssessment)
    setStorageWarning(
      saved
        ? ''
        : 'Your result is available in this session, but it could not be saved permanently.',
    )
  }

  function viewAssessment(item) {
    if (item) {
      setAssessment(item)
      setActivePage('Assess Device')
    } else {
      setActivePage('My Devices')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9f6]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
        historyCount={history.length}
      />

      <div className="min-h-screen lg:pl-64">
        <Navbar
          activePage={pageTitles[activePage]}
          setOpen={setSidebarOpen}
        />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-8">
          {storageWarning && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            >
              {storageWarning}
            </div>
          )}

          {activePage === 'Overview' && (
            <Overview
              history={history}
              onAssess={() => {
                setAssessment(null)
                setActivePage('Assess Device')
              }}
              onView={viewAssessment}
            />
          )}

          {activePage === 'Assess Device' && (
            <>
              {assessment ? (
                <AssessmentResult
                  {...assessment}
                  onEdit={() => setAssessment(null)}
                />
              ) : (
                <>
                  <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
                      <Leaf size={14} />
                      SMARTER TECH. GREENER FUTURE.
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Assess Your Device
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                      Give your old electronics a second life. Discover the
                      smartest way to reuse, repair, or recycle your device.
                    </p>
                  </div>

                  <AssessmentForm
                    onAssessmentComplete={handleAssessmentComplete}
                  />
                </>
              )}
            </>
          )}

          {activePage === 'My Devices' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  My Devices
                </h1>
                <p className="mt-3 text-sm text-gray-500">
                  View your saved assessments and revisit previous results.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAssessment(null)
                    setActivePage('Assess Device')
                  }}
                  className="mt-4 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  + Assess a new device
                </button>
              </div>

              <AssessmentHistory history={history} onView={viewAssessment} />
            </>
          )}

          {activePage === 'Refurbishment Centers' && (
            <RefurbishmentCenters
              onBack={() => setActivePage('Overview')}
            />
          )}

          {['Sustainability Dashboard', 'Settings'].includes(activePage) && (
            <PlaceholderPage
              title={activePage}
              onBack={() => setActivePage('Overview')}
            />
          )}

          <footer className="mt-10 border-t border-gray-200 py-6 text-center text-xs leading-5 text-gray-400">
            EcoRevive · Prototype · Rule-based health scores, experimental AI
            image classification, and illustrative estimates
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
