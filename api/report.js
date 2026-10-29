// Vercel serverless function — receives the contact form and forwards it to a
// Discord webhook. The webhook URL lives only in the DISCORD_WEBHOOK_URL
// environment variable, so it is never shipped to visitors in client code.

const KINDS = ['Suggestion', 'Bug report', 'Something else']
const ALLOWED_KINDS = new Set(KINDS)
const GREEN = 0x5ec262

const clip = (value, max) => String(value ?? '').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(501).json({ ok: false, error: 'Contact form is not configured yet.' })
  }

  const { kind, name, message, gotcha } = req.body || {}

  // Honeypot: bots fill every field. Pretend success so they stop probing.
  if (clip(gotcha, 10)) return res.status(200).json({ ok: true })

  const type = ALLOWED_KINDS.has(kind) ? kind : KINDS[0]
  const from = clip(name, 60) || 'Anonymous'
  const body = clip(message, 1800)

  if (body.length < 5) {
    return res.status(400).json({ ok: false, error: 'Message is too short.' })
  }

  const payload = {
    username: 'MiniHost website',
    embeds: [
      {
        title: type,
        description: body,
        color: GREEN,
        fields: [
          { name: 'From', value: from, inline: true },
          { name: 'Via', value: 'minihost landing page', inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    const hook = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!hook.ok) {
      return res.status(502).json({ ok: false, error: 'Discord rejected the message.' })
    }
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false, error: 'Could not reach Discord.' })
  }
}
