import { Resend } from 'resend'
import { readFileSync } from 'fs'

// Load .env manually (no dotenv dependency needed for a quick script)
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
)

const TO = process.argv[2]
if (!TO) { console.error('Usage: node send-test.js <destination-email>'); process.exit(1) }

const resend = new Resend(env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to:   TO,
  subject: 'Hello from Pioneer Species',
  text: 'This is a test email sent from the Pioneer Species project via Resend. It worked!',
})

if (error) {
  console.error('Failed to send:', error)
  process.exit(1)
}

console.log('Email delivered! Message ID:', data.id)
