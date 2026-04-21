export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const event = req.body

  console.log('[resend-webhook]', {
    type:      event?.type,
    email_id:  event?.data?.email_id,
    timestamp: event?.created_at,
  })

  return res.status(200).json({ received: true })
}
