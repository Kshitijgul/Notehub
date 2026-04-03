export const loadNotes = () => {
  const files = import.meta.glob('../content/**/*.md', {
    as: 'raw',
    eager: true
  })

  const notes = {}

  Object.entries(files).forEach(([path, content]) => {
    const parts = path.split('/')
    const folder = parts[parts.length - 2]
    const file = parts[parts.length - 1]

    if (!notes[folder]) {
      notes[folder] = []
    }

    notes[folder].push({
      file,
      content
    })
  })

  return notes
}