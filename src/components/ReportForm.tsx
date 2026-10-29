import { useState } from 'react'
import type { FormEvent } from 'react'

const KINDS = ['Suggestion', 'Bug report', 'Something else'] as const

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'failed'; message: string }

export default function ReportForm() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>(KINDS[0])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [gotcha, setGotcha] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (status.kind === 'sending') return
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, name, message, gotcha }),
      })
      const body = await res.json().catch(() => ({ ok: false }))
      if (res.ok && body.ok) {
        setStatus({ kind: 'sent' })
        setKind(KINDS[0])
        setName('')
        setMessage('')
      } else {
        setStatus({ kind: 'failed', message: body.error || 'The message did not go through.' })
      }
    } catch {
      setStatus({ kind: 'failed', message: 'Network problem — the message did not go through.' })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="report report--done" role="status">
        <h3>Sent</h3>
        <p>Thanks — that landed in the developer&rsquo;s Discord. Replies come back through Discord, so leave your name or a server if you want an answer.</p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus({ kind: 'idle' })}>
          Write another
        </button>
      </div>
    )
  }

  return (
    <form className="report" onSubmit={send}>
      <div className="report__row">
        <label className="report__field">
          <span className="report__label">What is it?</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>

        <label className="report__field">
          <span className="report__label">
            Your name or Discord tag <span className="report__opt">optional</span>
          </span>
          <input
            type="text"
            value={name}
            maxLength={60}
            placeholder="e.g. Sahal or steve"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <label className="report__field">
        <span className="report__label">Message</span>
        <textarea
          required
          value={message}
          maxLength={2000}
          rows={5}
          placeholder="Crash details, the Minecraft version you run, what you expected to happen…"
          onChange={(e) => setMessage(e.target.value)}
        />
        <span className="report__count">{message.length} / 2000</span>
      </label>

      <label className="report__gotcha" aria-hidden="true">
        Leave this empty
        <input type="text" tabIndex={-1} autoComplete="off" value={gotcha} onChange={(e) => setGotcha(e.target.value)} />
      </label>

      <div className="report__foot">
        <button type="submit" className="btn btn--primary" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : 'Send to Discord'}
        </button>
        {status.kind === 'failed' && (
          <p className="report__error" role="alert">
            {status.message} Please try again, or use “Suggestion or bug?” inside the app.
          </p>
        )}
      </div>
    </form>
  )
}
