import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2021</em>
    </div>
  )
}
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('input new note')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState('some error happened...')
  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`)
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService.update(id,changedNote).then(returnedNotes => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNotes))
    }) .catch(error => {
      setMessage(`Note '${note.content}' was already removed from server`)
      setTimeout(() => setMessage(null),5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }
  const hook = () => {
    console.log('effect');
    noteService.getAll().then(initialNotes => {
    console.log('fulfilled');
    setNotes(initialNotes)}
    )
  }
  console.log('render', notes.length, 'notes')
  useEffect(hook, [])
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }
    noteService.create(noteObject).then(returnedNotes =>
    {setNotes(notes.concat(returnedNotes))
    setNewNote('')})
  }
  const handleNoteChange = (event) => setNewNote(event.target.value)
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={message} />
      <ul>
        {notesToShow.map(note => 
            <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "important" : "all"}
      </button>
      <Footer />
    </div>
  )
}

export default App

