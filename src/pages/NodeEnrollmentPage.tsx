import { useMutation } from '@tanstack/react-query'
import { Copy, KeyRound } from 'lucide-react'
import { useState } from 'react'

function issueEnrollmentToken(payload: { region_key: string }): Promise<{ token: string; expires_in_sec: number }> {
  // POST /api/v1/node-enrollment-tokens with payload.region_key
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: `nrt_${payload.region_key.slice(0, 4)}_${Math.random().toString(36).slice(2, 12)}_${Date.now().toString(36)}`,
        expires_in_sec: 3600,
      })
    }, 800)
  })
}

export function NodeEnrollmentPage() {
  const [regionKey, setRegionKey] = useState('us-west-1')
  const [copied, setCopied] = useState(false)
  const mutation = useMutation({
    mutationFn: () => issueEnrollmentToken({ region_key: regionKey }),
  })

  const result = mutation.data

  const copyToken = () => {
    if (!result?.token) return
    navigator.clipboard.writeText(result.token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">Node enrollment</h2>
        <p className="mt-1 text-xs text-slate-400">
          Issue a one-time token for a new node. The node uses this token to register with the control plane.
        </p>
      </div>

      <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="region" className="block text-xs font-medium text-slate-300">
              Region
            </label>
            <input
              id="region"
              type="text"
              value={regionKey}
              onChange={(e) => setRegionKey(e.target.value)}
              placeholder="e.g. us-west-1"
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-70"
          >
            <KeyRound className="h-4 w-4" />
            {mutation.isPending ? 'Issuing…' : 'Issue enrollment token'}
          </button>
        </div>

        {mutation.isError && (
          <p className="mt-4 text-sm text-rose-400">
            Failed to issue token. Try again.
          </p>
        )}

        {result && (
          <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
            <p className="mb-2 text-xs font-medium text-slate-400">
              One-time token (expires in {result.expires_in_sec}s)
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded bg-slate-900 px-2 py-1.5 text-xs text-slate-200">
                {result.token}
              </code>
              <button
                type="button"
                onClick={copyToken}
                className="shrink-0 rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                title="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-xs text-emerald-400">Copied to clipboard.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
