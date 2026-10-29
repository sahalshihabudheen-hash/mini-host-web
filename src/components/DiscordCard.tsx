import { useEffect, useState } from 'react'
import { DISCORD_ID, lanyardUrl } from '../data/site'

type Activity = {
  id?: string
  name: string
  type: number
  details?: string | null
  state?: string | null
  timestamps?: { start?: number; end?: number }
}

type LanyardData = {
  discord_user: {
    id: string
    username: string
    global_name?: string | null
    display_name?: string | null
    avatar?: string | null
    avatar_decoration_data?: { asset?: string | null } | null
  }
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities: Activity[]
  listening_to_spotify: boolean
}

const STATUS_LABEL: Record<LanyardData['discord_status'], string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do not disturb',
  offline: 'Offline',
}

const avatarUrl = (id: string, hash: string | null | undefined) =>
  hash
    ? `https://cdn.discordapp.com/avatars/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`

const elapsed = (start?: number) => {
  if (!start) return ''
  const mins = Math.max(0, Math.round((Date.now() - start) / 60000))
  if (mins < 60) return ` · ${mins} min`
  return ` · ${Math.floor(mins / 60)}h ${mins % 60}m`
}

const DECOR_VERSIONS = ['2', '1']

function AvatarDecoration({ asset }: { asset: string }) {
  const [version, setVersion] = useState(0)
  if (version >= DECOR_VERSIONS.length) return null
  return (
    <img
      className="dcard__deco"
      src={`https://cdn.discordapp.com/avatar-decoration-avatar/${DECOR_VERSIONS[version]}/${asset}.png`}
      alt=""
      aria-hidden="true"
      onError={() => setVersion((v) => v + 1)}
    />
  )
}

export default function DiscordCard() {
  const [state, setState] = useState<{ kind: 'loading' } | { kind: 'ok'; data: LanyardData } | { kind: 'error'; message: string }>({ kind: 'loading' })

  useEffect(() => {
    if (!/^\d{15,25}$/.test(DISCORD_ID)) {
      setState({ kind: 'error', message: 'Discord ID is not configured on this site yet.' })
      return
    }
    let alive = true
    fetch(lanyardUrl(DISCORD_ID))
      .then((r) => r.json())
      .then((body: { success: boolean; data?: LanyardData; error?: { message?: string } }) => {
        if (!alive) return
        if (body.success && body.data) setState({ kind: 'ok', data: body.data })
        else setState({ kind: 'error', message: body.error?.message || 'Presence is not available right now.' })
      })
      .catch(() => alive && setState({ kind: 'error', message: 'Could not reach Discord presence service.' }))
    return () => {
      alive = false
    }
  }, [])

  if (state.kind === 'loading') {
    return (
      <div className="dcard">
        <div className="dcard__skeleton" aria-hidden="true" />
        <p className="dcard__loading">Checking Discord…</p>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="dcard">
        <p className="dcard__title">Discord</p>
        <p className="dcard__error">{state.message}</p>
        <p className="dcard__hint">
          Reach the developer through the form below regardless — presence is just a live status
          indicator.
        </p>
      </div>
    )
  }

  const { discord_user: user, discord_status: status, activities, listening_to_spotify } = state.data
  const shown = activities.filter((a) => (listening_to_spotify ? a.type !== 2 : true)).slice(0, 3)
  const name = user.global_name || user.display_name || user.username

  return (
    <div className="dcard">
      <div className="dcard__head">
        <span className={`dcard__avatar dcard__avatar--${status}`}>
          <img src={avatarUrl(user.id, user.avatar)} alt="" width={56} height={56} />
          {user.avatar_decoration_data?.asset && <AvatarDecoration asset={user.avatar_decoration_data.asset} />}
        </span>
        <div>
          <p className="dcard__name">{name}</p>
          <p className={`dcard__status dcard__status--${status}`}>
            <span className="dcard__dot" aria-hidden="true" />
            {STATUS_LABEL[status]}
          </p>
        </div>
      </div>

      {listening_to_spotify && (
        <p className="dcard__spotify">
          <span className="dcard__label">Listening to</span> Spotify
        </p>
      )}

      {shown.length > 0 ? (
        <ul className="dcard__acts">
          {shown.map((a, i) => (
            <li key={a.id ?? `${a.name}-${i}`} className="dcard__act">
              <span className="dcard__label">{a.type === 4 ? 'Status' : a.name}</span>
              <span className="dcard__acttext">
                {[a.details, a.state].filter(Boolean).join(' — ') || 'No details'}
                {elapsed(a.timestamps?.start)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dcard__idle">No activity right now.</p>
      )}
    </div>
  )
}
