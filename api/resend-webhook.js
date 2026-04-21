export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const event = req.body
  const { type, created_at } = event ?? {}
  const { email_id, to, subject } = event?.data ?? {}
  const ts = created_at ?? new Date().toISOString()

  switch (type) {
    case 'email.delivered':
      console.log(`[delivered] ${email_id} → ${to} "${subject}" at ${ts}`)
      break
    case 'email.opened':
      console.log(`[opened]    ${email_id} → ${to} "${subject}" at ${ts}`)
      break
    case 'email.clicked':
      console.log(`[clicked]   ${email_id} → ${to} url="${event?.data?.click?.link}" at ${ts}`)
      break
    case 'email.bounced':
      console.log(`[bounced]   ${email_id} → ${to} reason="${event?.data?.bounce?.message}" at ${ts}`)
      break
    default:
      console.log(`[resend-webhook] unhandled event type: ${type}`)
  }

  return res.status(200).json({ received: true })
}
