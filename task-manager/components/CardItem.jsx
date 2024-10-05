// This component renders a single card on the Kanban board.

import React from "react";

import {
  PencilIcon,
  ChatAlt2Icon,
  PaperClipIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Draggable } from "react-beautiful-dnd";

// This component takes a few properties:
//   - data: The item object to be displayed
//   - index: The index of the item in its column
//   - onEdit: Callback function for when the item is edited
//   - onDelete: Callback function for when the item is deleted
function CardItem({ data, index, onEdit, onDelete }) {
  const handleEditItem = e => {
    onEdit(data);
  }

  const handleDeleteItem = e => {
    onDelete(data);
  }

  return (
    <Draggable index={index} draggableId={data.id.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md p-3 m-3 mt-0 last:mb-0"
        >
           <label
            className={`bg-gradient-to-r
              px-2 py-1 rounded text-white text-sm
              ${
                data.priority === 0
                  ? "from-blue-600 to-blue-400"
                  : data.priority === 1
                  ? "from-green-600 to-green-400"
                  : "from-red-600 to-red-400"
              }
              `}
          >
            {data.priority === 0
              ? "Low Priority"
              : data.priority === 1
              ? "Medium Priority"
              : "High Priority"}
          </label>


          {/* Layout for a card item title*/}
          <h5 className="text-md my-3 text-lg leading-6">{data.title}</h5>
          <div className="flex justify-between">

            <ul className="flex space-x-3">
              {data.assignees ? data.assignees.map((ass, index) => {
                return (
                  <li key={index}>
                    {/* <Image
                      src={ass.avt}
                      width="36"
                      height="36"
                      objectFit="cover"
                      className=" rounded-full "
                    /> */}
                  </li>
                );
              }) : <li></li>}
              <li>
                <button
                  className="border border-stone-500 flex items-center w-9 h-9 mx-1 justify-center
                    rounded-full"
                >
                  <PencilIcon className="w-5 h-5 text-iconGrey" onClick={handleEditItem}/>
                </button>
              </li>
              <li>
                <button
                  className="border border-stone-500 flex items-center w-9 h-9 mx-1 justify-center
                    rounded-full"
                >
                  <TrashIcon className="w-5 h-5 text-iconGrey" onClick={handleDeleteItem}/>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
      )}
    </Draggable>
  );
}

export default CardItem;