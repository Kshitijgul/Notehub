import React from "react"
import ReactMarkdown from "react-markdown"

const Viewer = ({ note }) => {
  return (
    <div className="viewer">
      {note ? (
        <ReactMarkdown>{note.content}</ReactMarkdown>
      ) : (
        <h2>Select a Note</h2>
      )}
    </div>
  )
}

export default Viewer