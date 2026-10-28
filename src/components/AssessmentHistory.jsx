
import { Laptop, Smartphone, Eye, History, Inbox } from 'lucide-react'

export default function AssessmentHistory({
  history,
  onView,
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
          <Inbox size={28} />
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          No assessments yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Your completed device assessments will appear here. Assess a device
          to start building your local history.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
          <History size={22} />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Assessment history</h2>
          <p className="text-sm text-gray-500">
            {history.length} saved assessment{history.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {history.map((item) => {
          const device = item.device || {}
          const result = item.result || {}
          const deviceName = `${device.brand || 'Unknown'} ${device.model || 'Device'}`

          return (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                  {['Smartphone', 'Tablet'].includes(device.deviceType) ? (
                    <Smartphone size={23} />
                  ) : (
                    <Laptop size={23} />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {deviceName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {device.deviceType || 'Device'} ·{' '}
                    {item.assessedAt
                      ? new Date(item.assessedAt).toLocaleString()
                      : 'Date unavailable'}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Health score:{' '}
                    <strong>{result.score ?? '—'}/100</strong>
                    {' · '}
                    {item.recommendation?.action || 'No recommendation'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onView(item)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <Eye size={17} />
                View details
              </button>
            </div>
          )
        })}
      </div>

      <p className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
        Stored in this browser only. Clearing browser data may remove this history.
      </p>
    </div>
  )
}
