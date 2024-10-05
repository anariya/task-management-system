import React from 'react'
import {
    ChevronDownIcon,
    PlusIcon,
    DotsVerticalIcon,
    PlusCircleIcon,
    TrashIcon
  } from "@heroicons/react/outline";

const AddColumn = () => {
  return (
    <div>
        <button className="flex justify-center items-center my-3 space-x-2 text-lg"
                                  onClick={() => {setSelectedBoard(bIndex); setShowForm(true);}}
                                >
                                  <span className='text-base'>Add List</span>
                                  <PlusCircleIcon className="w-5 h-5 text-iconGrey" />
            
        </button>
    </div>
  )
}

export default AddColumn