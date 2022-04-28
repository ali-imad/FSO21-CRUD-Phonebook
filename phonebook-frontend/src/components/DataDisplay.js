import React from 'react'

const DataDisplay = ({ names, deleteHandler }) => {
  const data = names.map(entry => (
    <p key={entry.id}>
      {entry.name}: {entry.number}{' '}
      <button value={entry.id} onClick={deleteHandler}>
        Delete Entry
      </button>
    </p>
  ))
  return (
    <div>
      <h2>Numbers</h2>
      {data}
    </div>
  )
}

export default DataDisplay
