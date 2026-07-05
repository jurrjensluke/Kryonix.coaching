import {attentionQueue, dashboardClients, dashboardSummaries} from '@/domain/dashboard/dashboard-sample-data'
import type {DashboardStatus} from '@/domain/dashboard/dashboard-status'

const statusStyles: Record<DashboardStatus, {label: string; className: string}> = {
  needsReview: {
    label: 'Needs review',
    className: 'border-[#80e0b2]/50 bg-[#80e0b2]/12 text-[#a8f1ca]',
  },
  atRisk: {
    label: 'At risk',
    className: 'border-[#f07178]/50 bg-[#f07178]/12 text-[#ffb0b5]',
  },
  fading: {
    label: 'Fading',
    className: 'border-[#f2c46d]/50 bg-[#f2c46d]/12 text-[#f6d99a]',
  },
  onTrack: {
    label: 'On track',
    className: 'border-[#6f7c83]/50 bg-[#20262a] text-[#dce4e8]',
  },
}

export function DashboardContent() {
  return (
    <main className="min-h-screen bg-[#101315] text-[#f5f7f8]">
      <section className="border-b border-[#263036] px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#80e0b2]">Kryonix Coaching</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Coach dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#aab4b9]">
              Static roster shell for the pilot coach workspace. Live client, programme, check-in,
              and message data will come from Firebase after auth and rules are in place.
            </p>
          </div>
          <div className="rounded-md border border-[#344047] bg-[#171b1e] px-4 py-3 text-sm text-[#c8d1d5]">
            Data source: static sample records
          </div>
        </div>
      </section>

      <section className="px-5 py-6 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {dashboardSummaries.map((summary) => (
            <article key={summary.label} className="rounded-md border border-[#263036] bg-[#171b1e] p-4">
              <p className="text-sm font-medium text-[#aab4b9]">{summary.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{summary.value}</p>
              <p className="mt-2 min-h-10 text-sm leading-5 text-[#7f8b91]">{summary.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-md border border-[#263036] bg-[#171b1e]">
            <div className="flex flex-col gap-2 border-b border-[#263036] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Roster</h2>
                <p className="mt-1 text-sm text-[#aab4b9]">
                  Compliance, readiness, and coach review state.
                </p>
              </div>
              <p className="text-sm text-[#7f8b91]">{dashboardClients.length} pilot clients</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-[#263036] bg-[#131719] text-[#7f8b91]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Programme</th>
                    <th className="px-4 py-3 font-medium">Compliance</th>
                    <th className="px-4 py-3 font-medium">Readiness</th>
                    <th className="px-4 py-3 font-medium">Check-in</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263036]">
                  {dashboardClients.map((client) => (
                    <tr key={client.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{client.name}</p>
                        <p className="mt-1 text-xs text-[#7f8b91]">{client.lastSession}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[#dce4e8]">{client.programme}</p>
                        <p className="mt-1 text-xs text-[#7f8b91]">{client.phase}</p>
                      </td>
                      <td className="px-4 py-4 text-[#dce4e8]">{client.compliancePercentage}%</td>
                      <td className="px-4 py-4 text-[#dce4e8]">
                        {formatReadinessTrend(client.readinessTrend)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[#dce4e8]">{client.nextCheckIn}</p>
                        <p className="mt-1 text-xs text-[#7f8b91]">
                          {client.pendingCheckIns} pending, {client.unreadClientMessages} unread
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill status={client.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-md border border-[#263036] bg-[#171b1e]">
              <div className="border-b border-[#263036] px-4 py-4">
                <h2 className="text-xl font-semibold text-white">Attention queue</h2>
                <p className="mt-1 text-sm text-[#aab4b9]">
                  Clients with check-in, message, risk, or fading signals.
                </p>
              </div>
              <div className="divide-y divide-[#263036]">
                {attentionQueue.map((client) => (
                  <article key={client.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <p className="mt-1 text-sm leading-5 text-[#aab4b9]">{client.coachNote}</p>
                      </div>
                      <StatusPill status={client.status} />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-[#263036] bg-[#171b1e] p-4">
              <h2 className="text-xl font-semibold text-white">Programme and message summary</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <SummaryRow label="Programme blocks" value="6 active assignments" />
                <SummaryRow label="Check-in reviews" value="2 pending client updates" />
                <SummaryRow label="Message inbox" value="3 unread client replies" />
                <SummaryRow label="Firebase state" value="Auth-gated sample shell" />
              </dl>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

function StatusPill({status}: {status: DashboardStatus}) {
  const style = statusStyles[status]

  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${style.className}`}>
      {style.label}
    </span>
  )
}

function SummaryRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#263036] pb-3 last:border-b-0 last:pb-0">
      <dt className="text-[#7f8b91]">{label}</dt>
      <dd className="text-right font-medium text-[#dce4e8]">{value}</dd>
    </div>
  )
}

function formatReadinessTrend(value: number) {
  return value > 0 ? `+${value}` : value.toString()
}
