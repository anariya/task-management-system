// This component provides functionality for the Kanban board view that is shown to a user after logging in.

import Layout from "@/components/Layout";
import DefaultBoard from "../data/default-board.json";

import {
  ChevronDownIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import CardItem from "../components/CardItem";
import EditItemForm from "../components/EditItemForm";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import EditColumnForm from "./EditColumnForm";
import DeleteModal from "./DeleteModal";

// This component takes one property, the ID of the selected group.
export default function Dashboard({ groupID }) {
  const [text, setText] = useState("");

  // boardData: this state variable stores an array representing the state of the Kanban board.
  // This array consists of column objects, each of which has a name property and an items array.
  // Each item in turn stores the information necessary to render its card:
  //   - id: The unique numeric identifier for the item
  //   - title: The title of the item, displayed on the card itself
  //   - columnId: The unique numeric identifier for the column the item is in
  //   - columnIndex: The (zero-based) index the item is ordered in within its column
  //   - assignees: An array of usernames of users the item has been assigned to
  const [boardData, setBoardData] = useState([]);

  // showAddItemForm: this state variable denotes whether the add item form should be shown.
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  // showEditItemForm: this state variable denotes whether the edit item form should be shown.
  const [showEditItemForm, setShowEditItemForm] = useState(false);
  const [showAdd, setshowAdd] = useState(false);
  const [showEditColumnForm, setShowEditColumnForm] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  //
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [columnToEdit, setColumnToEdit] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);

  // Refreshes the board, retrieving and updating the board data for the current user from the API.
  const refreshBoard = async () => {
    const res = await fetch(`api/items?groupid=${groupID}`);
    const data = await res.json();

    setBoardData(data);

    console.log(JSON.stringify(data));
  };

  useEffect(() => {
    refreshBoard();
  }, []);

  // This code is executed when an item is dropped anywhere on the board. It updates the database to
  // reflect the new ordering of items.
  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = boardData;
    var dragItem =
      newBoardData[parseInt(re.source.droppableId)].items[re.source.index];

    console.log("dragging item");
    console.log(JSON.stringify(dragItem));
    console.log(re.source.index);

      const updatedItem = {
      ...dragItem,
      columnIndex: re.destination.droppableId,
      itemIndex: re.destination.index,
      columnid: newBoardData[parseInt(re.destination.droppableId)].column_id,
    };

    console.log("destination item");
    console.log(JSON.stringify(updatedItem));
    console.log(re.destination.index);

    if (parseInt(re.source.droppableId) !== parseInt(re.destination.droppableId)) {
      // moving item between columns
      newBoardData[parseInt(re.source.droppableId)].items.forEach((item) => {
        if (item.itemIndex > re.source.index) {
          item.itemIndex--;
          editItem(item);
        }
      });
  
      newBoardData[parseInt(re.destination.droppableId)].items.forEach((item) => {
        if (item.itemIndex >= re.destination.index) {
          item.itemIndex++;
          editItem(item);
        }
      });
    } else {
      // moving item within column
      if (re.source.index < re.destination.index) {
        newBoardData[parseInt(re.source.droppableId)].items.forEach(item => {
          if (item.itemIndex > re.source.index && item.itemIndex <= re.destination.index) {
            item.itemIndex--;
            editItem(item);
          }
        });
      } else if (re.source.index > re.destination.index) {
        newBoardData[parseInt(re.source.droppableId)].items.forEach(item => {
          if (item.itemIndex >= re.destination.index && item.itemIndex < re.source.index) {
            item.itemIndex++;
            editItem(item);
          }
        });
      }

    }
    

    

    editItem(updatedItem, true);
  };

  const onTextAreaKeyPress = (e) => {
    if (e.keyCode === 13) {
      //Enter
      const val = e.target.value;
      if (val.length === 0) {
        setShowAddItemForm(false);
      } else {
        const boardId = e.target.attributes["data-id"].value;
        const columnid = e.target.attributes["column-id"].value;
        const length = e.target.attributes["board-length"].value;
        console.log(length);
        addItem({
          columnid: columnid,
          columnIndex: Number(boardId),
          itemIndex: Number(length),
          title: val,
          priority: 0,
          assignees: [],
        });
        setShowAddItemForm(false);
        e.target.value = "";
      }
    }
  };

  const addColumn = async (item) => {
    await fetch("/api/column", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: item,
      }),
    });
    setText("");
    refreshBoard();
  };

  const onAddColumn = (e) => {
    if (e.keyCode === 13) {
      //Enter
      const value = e.target.value;
      if (value.length === 0) {
        setshowAdd(false);
      } else {
        addColumn({
          name: value,
          groupid: groupID,
        });
        setshowAdd(false);
        e.target.value = "";
      }
    }
  };

  // Given an item object, sends an API request to add this item to the database.
  const addItem = async (item) => {
    await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupid: groupID,
        item: item,
      }),
    });
    setText("");
    refreshBoard();
  };

  // Given an item object, sends an API request to edit this item in the database, if one with
  // the same ID exists. Optionally refreshes the board after a response is recieved.
  const editItem = async (item, refresh = false) => {
    await fetch("/api/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: item }),
    });
    if (refresh) {
      refreshBoard();
    }
  };

  const editColumn = async (column, refresh = false) => {
    await fetch("/api/column", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ column: column }),
    });
    if (refresh) {
      refreshBoard();
    }
  };

  const onItemDelete = async (item) => {
    await fetch("/api/items", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: item }),
    });
    refreshBoard();
  };

  const deleteColumn = async (column, refresh = false) => {
    await fetch("/api/column", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ column: column }),
    });

    refreshBoard();
  };

  const onItemEdit = (item) => {
    setItemToEdit(item);
    setShowEditItemForm(true);
  };

  const onEditItemSubmit = async (item) => {
    setShowEditItemForm(false);
    if (item) {
      editItem(item, true);
    }
  };
  const onEditColumnSubmit = async (column) => {
    setShowEditColumnForm(false);
    if (column) {
      editColumn(column, true);
    }
    console.log(showEditColumnForm);
  };

  const onDeleteColumnConfirm = async (column) => {
    setShowDeleteColumnModal(false);
    if (column) {
      deleteColumn(column, true);
    }
  };

  const onColumnEdit = (column) => {
    setColumnToEdit(column);

    setShowEditColumnForm(true);
  };

  const onColumnDelete = (column) => {
    setColumnToDelete(column);

    setShowDeleteColumnModal(true);
  };

  return (
    <div>
      {/* If necessary, display the edit item form. This form displays in a div that covers the entire screen so the rest 
      of the UI cannot be interacted with. */}
      {showEditItemForm && (
        <div className="absolute w-screen h-screen z-10000 bg-transparent flex items-center justify-center">
          <EditItemForm item={itemToEdit} onSubmit={onEditItemSubmit} />
        </div>
      )}
      {showEditColumnForm && (
        <div className="absolute w-screen h-screen z-10000 bg-transparent flex items-center justify-center">
          <EditColumnForm column={columnToEdit} onSubmit={onEditColumnSubmit} />
        </div>
      )}
      {showDeleteColumnModal && (
        <div className="absolute w-screen h-screen z-10000 bg-transparent flex items-center justify-center">
          <DeleteModal
            column={columnToDelete}
            onDelete={onDeleteColumnConfirm}
          />
        </div>
      )}
      <div className="p-10">
        {/* Header */}
        <div className="flex items-center">
          <h4 className="text-2xl font-semibold text-black">Kanban Board</h4>
          <ChevronDownIcon className="w-9 h-9 text-iconGrey rounded-full bg-white p-1 ml-5 shadow-xl"></ChevronDownIcon>
        </div>
        {/* Kanban board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-5 my-5 z-100">
            {/* Render all columns of the board */}
            {boardData.map((board, bIndex) => {
              return (
                <div key={board.name}>
                  <Droppable droppableId={bIndex.toString()}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div
                          className={`bg-gray-100 rounded-md shadow-md
                          flex flex-col z-100 overflow-hidden
                          ${snapshot.isDraggingOver && "bg-green-100"}`}
                        >
                          {/* Column header */}
                          <span
                            className="w-full h-1 bg-gradient-to-r from-pink-700 to-red-200
                      absolute inset-x-0 top-0"
                          ></span>
                          <h4 className=" p-3 flex justify-between items-center mb-2">
                            <span className="text-xl text-black font-medium">
                              {board.name}
                            </span>
                            <PencilIcon
                              className="w-5 h-5 rounded-md text-iconGrey hover:bg-gray-400"
                              onClick={() => onColumnEdit(board)}
                            />
                            <TrashIcon
                              className="w-5 h-5 rounded-sm text-iconGrey hover:bg-gray-400"
                              onClick={() => onColumnDelete(board)}
                            />
                          </h4>

                          {/* Sort items by column index and render them */}
                          <div
                            className="overflow-y-auto overflow-x-hidden h-auto"
                            style={{ maxHeight: "calc(100vh - 290px)" }}
                          >
                            {board.items.length > 0 &&
                              board.items
                                .sort((a, b) => a.itemIndex - b.itemIndex)
                                .map((item, IIndex) => {
                                  return (
                                    <CardItem
                                      key={item.id}
                                      data={item}
                                      index={item.itemIndex}
                                      className="m-3"
                                      onEdit={onItemEdit}
                                      onDelete={onItemDelete}
                                    />
                                  );
                                })}
                            {provided.placeholder}
                          </div>

                          {/* Add item */}
                          {showAddItemForm && selectedBoard === bIndex ? (
                            <div className=" p-3">
                              <textarea
                                className="px-2 border-gray-300 rounded focus:ring-purple-400 w-full"
                                rows={3}
                                placeholder="Add task description"
                                data-id={bIndex}
                                column-id={board.column_id}
                                board-length={board.items.length}
                                onKeyDown={(e) => onTextAreaKeyPress(e)}
                              />
                            </div>
                          ) : (
                            <button
                              className="flex justify-center items-center my-3 space-x-2 text-lg"
                              onClick={() => {
                                setSelectedBoard(bIndex);
                                setShowAddItemForm(true);
                              }}
                            >
                              <span className="text-base">Add Task</span>
                              <PlusCircleIcon className="w-5 h-5 text-iconGrey" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
            {showAdd ? (
              <div className=" p-3">
                <textarea
                  className="px-2 border-gray-300 rounded focus:ring-purple-400 w-full"
                  rows={3}
                  placeholder="New column name"
                  onKeyDown={(e) => onAddColumn(e)}
                />
              </div>
            ) : (
              <button
                className="flex justify-center items-center my-3 space-x-2 text-lg h-10"
                onClick={() => {
                  setshowAdd(true);
                }}
              >
                <span className="text-base">Add Column</span>
                <PlusCircleIcon className="w-5 h-5 text-iconGrey" />
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
