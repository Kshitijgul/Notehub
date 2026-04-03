import React from "react"

const Sidebar = ({ notes, onSelect }) => {
  return (
    <div className="sidebar">
      <h2>📚 Notes</h2>

      {Object.entries(notes).map(([folder, files]) => (
        <div key={folder}>
          <h3>{folder}</h3>

          {files.map((file, index) => (
            <p
              key={index}
              className="file"
              onClick={() => onSelect(file)}
            >
              {file.file}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Sidebar