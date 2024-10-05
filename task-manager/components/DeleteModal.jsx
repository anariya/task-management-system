
import React from 'react'

const DeleteModal = ({column, onDelete}) => {
  const handleDelete = (e) =>{
    onDelete(column)
    e.preventDefault()
  }
 
  return (
    
    <div className="modal-box bg-slate-600 h-auto w-auto p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold text-white">Hello!</h3>
    <p className="py-4 text-white">Are you sure you want to proceed?</p>
    <div className="modal-action flex justify-end">
      <button 
        className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" 
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  </div>

  )
}

export default DeleteModal