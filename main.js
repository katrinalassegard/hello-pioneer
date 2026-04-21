import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const notesList  = document.getElementById('notes-list')
const form       = document.getElementById('note-form')
const titleInput = document.getElementById('title')
const bodyInput  = document.getElementById('body')
const submitBtn  = document.getElementById('submit-btn')
const statusMsg  = document.getElementById('status')

function showStatus(msg, type) {
  statusMsg.textContent = msg
  statusMsg.className = `status-msg ${type}`
  if (type === 'success') setTimeout(() => { statusMsg.className = 'status-msg' }, 3000)
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  })
}

function renderNotes(notes) {
  if (!notes.length) {
    notesList.innerHTML = '<div class="empty-state">No notes yet — be the first to post one.</div>'
    return
  }
  notesList.innerHTML = notes.map(n => `
    <div class="note-card">
      <div class="note-title">${escHtml(n.title)}</div>
      <div class="note-body">${escHtml(n.body)}</div>
      <div class="note-date">${formatDate(n.created_at)}</div>
    </div>
  `).join('')
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

async function loadNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, body, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    showStatus('Failed to load notes: ' + error.message, 'error')
    return
  }
  renderNotes(data)
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  submitBtn.disabled = true
  submitBtn.textContent = 'Posting…'

  const { error } = await supabase
    .from('notes')
    .insert({ title: titleInput.value.trim(), body: bodyInput.value.trim() })

  submitBtn.disabled = false
  submitBtn.textContent = 'Post Note'

  if (error) {
    showStatus('Error: ' + error.message, 'error')
    return
  }

  titleInput.value = ''
  bodyInput.value  = ''
  showStatus('Note posted!', 'success')
  await loadNotes()
})

loadNotes()
