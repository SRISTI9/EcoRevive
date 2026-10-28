
import {
  ArrowLeft,
  Recycle,
  Wrench,
  Heart,
  ShoppingBag,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ScanSearch,
  AlertCircle,
} from 'lucide-react'

const actionIcons = {
  Sell: ShoppingBag,
  Donate: Heart,
  'Repair/Refurbish': Wrench,
  Recycle,
}

const actionColors = {
  Sell: 'bg-blue-50 text-blue-800 border-blue-100',
  Donate: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  'Repair/Refurbish': 'bg-amber-50 text-amber-800 border-amber-100',
  Recycle: 'bg-purple-50 text-purple-800 border-purple-100',
}

function HealthRing({ score }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg
        className="-rotate-90"
        width="144"
        height="144"
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Illustrative device health score: ${score} out of 100`}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="9"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={
            score >= 70
              ? '#047857'
              : score >= 40
                ? '#d97706'
                : '#dc2626'
          }
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-3xl font-bold text-gray-900">{score}</p>
        <p className="text-xs text-gray-500">out of 100</p>
      </div>
    </div>
  )
}

function AIAnalysisCard({ aiAnalysis }) {
  if (!aiAnalysis) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
            <ScanSearch size={23} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              AI photo analysis
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              No photo was analyzed. Return to the form and upload a
              JPG, PNG, or WEBP image.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (aiAnalysis.error) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3 text-amber-900">
          <AlertCircle size={23} className="mt-1 shrink-0" />

          <div>
            <h3 className="font-bold">AI analysis unavailable</h3>

            <p className="mt-1 text-sm leading-6">
              {aiAnalysis.error}
            </p>

            <p className="mt-2 text-xs leading-5">
              Check that the Python AI service is running at
              127.0.0.1:8000. Your manual assessment can still be
              reviewed separately.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const predictions = Array.isArray(aiAnalysis.predictions)
    ? aiAnalysis.predictions
    : []

  const topPrediction = aiAnalysis.topPrediction

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
          <ScanSearch size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Computer vision prototype
          </p>

          <h3 className="mt-1 text-xl font-bold text-gray-900">
            AI photo analysis
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-600">
            The first uploaded photo was compared with descriptions
            of possible device conditions.
          </p>
        </div>
      </div>

      {topPrediction && (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Top matching description
          </p>

          <p className="mt-2 font-semibold leading-6 text-gray-900">
            {topPrediction.label}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Similarity score:{' '}
            {(Number(topPrediction.confidence) * 100).toFixed(2)}%
          </p>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="mt-5">
          <h4 className="font-semibold text-gray-900">
            Other model matches
          </h4>

          <div className="mt-3 space-y-3">
            {predictions.map((prediction) => (
              <div key={prediction.label}>
                <div className="mb-1 flex items-start justify-between gap-3 text-sm">
                  <span className="leading-5 text-gray-600">
                    {prediction.label}
                  </span>

                  <span className="shrink-0 font-semibold tabular-nums text-gray-800">
                    {(Number(prediction.confidence) * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          Number(prediction.confidence) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />

        <p>
          <strong>Experimental result:</strong> these are relative
          model similarity scores, not validated probabilities of
          damage. CLIP is not a specialist electronic-device defect
          detector. Inspect the device before making a repair, sale,
          donation, or recycling decision.
        </p>
      </div>
    </section>
  )
}

export default function AssessmentResult({
  device,
  result,
  recommendation,
  factors,
  aiAnalysis,
  assessmentMode = 'compare',
  onEdit,
}) {
  const ActionIcon =
    actionIcons[recommendation.action] || Recycle

  const age = new Date().getFullYear() - Number(device.year)
  const ageFactor =
    Number.isFinite(age) && age >= 0 ? age : 0

  const aiLabel =
    aiAnalysis?.topPrediction?.label?.toLowerCase() || ''

  const aiSuggestsScreenDamage =
    /crack|shatter|broken|display/.test(aiLabel) &&
    !aiLabel.includes('good physical condition')

  const manualLooksUndamaged =
    ['Excellent', 'Good'].includes(device.screen) &&
    device.damage === 'None'

  const hasConditionMismatch =
    assessmentMode === 'compare' &&
    Boolean(aiAnalysis?.topPrediction) &&
    !aiAnalysis?.error &&
    aiSuggestsScreenDamage &&
    manualLooksUndamaged

  // Illustrative estimates only; not live market valuations.
  const priceBase = {
    Laptop: 18000,
    Smartphone: 10000,
    Tablet: 8000,
    Desktop: 15000,
    Other: 3000,
  }[device.deviceType] || 5000

  const multiplier = result.score / 100

  const resaleLow =
    Math.round((priceBase * multiplier * 0.35) / 500) * 500

  const resaleHigh =
    Math.round((priceBase * multiplier * 0.65) / 500) * 500

  const repairLow =
    Math.round(((100 - result.score) * 40) / 500) * 500

  const repairHigh = Math.max(
    1000,
    Math.round(((100 - result.score) * 100) / 500) * 500,
  )

  const isAIOnly = assessmentMode === 'ai'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            ASSESSMENT COMPLETE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Your device assessment
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Review your assessment and experimental AI photo analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Edit details
        </button>
      </div>

      {recommendation.safetyWarning && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900"
        >
          <ShieldAlert size={25} className="shrink-0" />

          <div>
            <h3 className="font-bold">Battery safety warning</h3>

            <p className="mt-1 text-sm leading-6">
              Do not charge, puncture, or attempt DIY repair on a
              potentially damaged battery. Seek qualified service or
              authorized e-waste handling.
            </p>
          </div>
        </div>
      )}

      {!isAIOnly && assessmentMode !== 'manual' && (
        <AIAnalysisCard aiAnalysis={aiAnalysis} />
      )}

      {hasConditionMismatch && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950"
        >
          <AlertTriangle size={22} className="mt-0.5 shrink-0" />

          <div>
            <h3 className="font-bold">
              Manual and photo results disagree — verification required
            </h3>

            <p className="mt-1 text-sm leading-6">
              Your manual entries report a good screen and no physical
              damage, but the AI model suggests possible screen damage.
              The recommendation and price estimates are on hold.
              Check the image and correct the manual condition if
              needed. The AI result is experimental and is not a
              confirmed diagnosis.
            </p>
          </div>
        </div>
      )}

      {!isAIOnly && (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              {hasConditionMismatch
                ? 'DEVICE HEALTH · PROVISIONAL'
                : 'DEVICE HEALTH'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-6">
              <HealthRing score={result.score} />

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {device.brand} {device.model}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {device.deviceType} · Purchased {device.year}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
                  {hasConditionMismatch
                    ? 'Needs verification'
                    : result.category}
                </span>

                <p className="mt-3 text-xs text-gray-500">
                  {hasConditionMismatch
                    ? 'Provisional manual score — verify the disputed condition'
                    : 'Rule-based illustrative assessment'}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <h4 className="font-semibold text-gray-900">
                Factors considered
              </h4>

              <div className="mt-3 space-y-3">
                {factors.map((factor) => (
                  <div
                    key={factor.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-gray-600">
                      {factor.name}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        factor.impact === 'Acceptable'
                          ? 'bg-emerald-50 text-emerald-800'
                          : factor.impact === 'Critical'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {factor.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className={`rounded-2xl border p-6 shadow-sm ${
              hasConditionMismatch
                ? 'border-amber-200 bg-amber-50'
                : 'border-gray-100 bg-white'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                hasConditionMismatch
                  ? 'text-amber-800'
                  : 'text-gray-500'
              }`}
            >
              {hasConditionMismatch
                ? 'RECOMMENDATION ON HOLD'
                : 'RECOMMENDED NEXT STEP'}
            </p>

            {hasConditionMismatch ? (
              <div className="mt-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-amber-200 bg-white p-4 text-amber-800">
                    <AlertTriangle size={30} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-amber-950">
                      Needs verification
                    </h3>

                    <p className="mt-1 text-sm text-amber-900">
                      No final sale, donation, repair, or recycling
                      recommendation yet.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-amber-950">
                  The image model suggests possible screen damage,
                  while the manual fields say the screen is good and
                  physical damage is absent. Review the image and
                  update the manual entries, then submit again.
                </p>

                <button
                  type="button"
                  onClick={onEdit}
                  className="mt-5 rounded-xl bg-amber-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-950"
                >
                  Review device condition
                </button>

                <p className="mt-4 text-xs leading-5 text-amber-900">
                  Resale and repair estimates are hidden until the
                  condition is verified.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 flex items-center gap-4">
                  <div
                    className={`rounded-2xl border p-4 ${
                      actionColors[recommendation.action] ||
                      'bg-gray-50 text-gray-800 border-gray-100'
                    }`}
                  >
                    <ActionIcon size={30} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {recommendation.action}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Based on the reported device condition
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-gray-600">
                  {recommendation.explanation}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500">
                      Preliminary resale estimate
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-900">
                      ₹{resaleLow.toLocaleString('en-IN')}–₹
                      {resaleHigh.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500">
                      Illustrative repair estimate
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-900">
                      ₹{repairLow.toLocaleString('en-IN')}–₹
                      {repairHigh.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {ageFactor >= 6 && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    This device is at least six years old. Actual resale
                    value may be substantially lower.
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {!isAIOnly && (
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0 text-emerald-700"
          />

          <p>
            <strong>Prototype disclaimer:</strong> the health score
            is calculated from illustrative rules, not from the image
            model. Price ranges are preliminary examples, not market
            quotes. AI image classification is experimental and may
            be wrong. A professional inspection may produce a
            different result.
          </p>
        </div>
      )}
    </div>
  )
}
