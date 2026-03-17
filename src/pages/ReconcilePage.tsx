import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, Play } from 'lucide-react'
import { useState } from 'react'

type ReconcilePlan = {
  desired_regions: number
  actual_regions: number
  desired_nodes: number
  actual_nodes: number
  drift: string[]
  last_run_at: string | null
}

function fetchReconcilePlan(): Promise<ReconcilePlan> {
  // GET /api/v1/reconcile-plan
  return Promise.resolve({
    desired_regions: 6,
    actual_regions: 6,
    desired_nodes: 28,
    actual_nodes: 27,
    drift: ['node-eu-456: config version mismatch'],
    last_run_at: '2024-03-17T08:15:00Z',
  })
}

function runReconcile(): Promise<ReconcilePlan> {
  // POST /api/v1/reconcile-run
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        desired_regions: 6,
        actual_regions: 6,
        desired_nodes: 28,
        actual_nodes: 28,
        drift: [],
        last_run_at: new Date().toISOString(),
      })
    }, 1500)
  })
}

export function ReconcilePage() {
  const [runResult, setRunResult] = useState<ReconcilePlan | null>(null)
  const { data: plan, isLoading } = useQuery({
    queryKey: ['reconcile', 'plan'],
    queryFn: fetchReconcilePlan,
  })
  const runMutation = useMutation({
    mutationFn: runReconcile,
    onSuccess: setRunResult,
  })

  const display = runResult ?? plan
  const hasDrift = (display?.drift?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Reconcile plan
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Desired vs actual state. Trigger a run to align infrastructure.
          </p>
        </div>
        <button
          type="button"
          onClick={() => runMutation.mutate()}
          disabled={runMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70"
        >
          {runMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {runMutation.isPending ? 'Running…' : 'Run reconcile'}
        </button>
      </div>

      {isLoading && !display ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
          Loading plan…
        </div>
      ) : display ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PlanCard
              label="Regions"
              desired={display.desired_regions}
              actual={display.actual_regions}
            />
            <PlanCard
              label="Nodes"
              desired={display.desired_nodes}
              actual={display.actual_nodes}
            />
          </section>

          {hasDrift && (
            <div className="rounded-xl border border-amber-800/50 bg-amber-950/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                Drift detected
              </h3>
              <ul className="space-y-1 text-xs text-amber-200/90">
                {display.drift.map((d, i) => (
                  <li key={i} className="font-mono">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {display.last_run_at && (
            <p className="text-xs text-slate-500">
              Last run: {new Date(display.last_run_at).toLocaleString()}
            </p>
          )}
        </>
      ) : null}
    </div>
  )
}

function PlanCard({
  label,
  desired,
  actual,
}: {
  label: string
  desired: number
  actual: number
}) {
  const ok = desired === actual
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 flex items-center gap-2">
        <span className="text-xl font-semibold text-slate-50">
          {actual} / {desired}
        </span>
        {ok ? (
          <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
            OK
          </span>
        ) : (
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
            Drift
          </span>
        )}
      </p>
    </article>
  )
}
