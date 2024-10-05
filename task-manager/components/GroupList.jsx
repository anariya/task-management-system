import React, { useState } from 'react';
import {
  DotsVerticalIcon
} from "@heroicons/react/outline";

const GroupList = ({ groups, onViewGroup, onEditGroup, onDeleteGroup, isAdmin }) => {
    // State management for the triple dot menu
    const [tooltipID, setTooltipID] = useState(null);
    
    const handleTooltipToggle = (id) => {
        setTooltipID(tooltipID === id ? null : id);
    }

    return (
        <div className="flex flex-wrap gap-10 px-10 py-5"> {/* Flex container with wrapping and spacing */}
            {groups && groups.length > 0 ? (
                groups.map((group) => (
                    <div key={group.id} className="relative flex-shrink-0 p-4 border rounded-lg shadow-md bg-white w-80 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg "> {/* Fixed width for items */}
                        <div className="flex flex-col h-full">
                            <div className="relative flex flex-col flex-grow items-center justify-center">
                                <p className='text-lg font-semibold text-center'>{group.name}</p>
                                <p>Members: {group.users.length}</p>
                                
                                {/* Handles functionality of the triple dot delete menu. Only visible to admin*/}
                                {isAdmin(group) && (
                                    <div className="absolute right-0">
                                        <button
                                            onClick={() => handleTooltipToggle(group.id)}
                                            className='bg-white p-0 mr-0'
                                        >
                                            <DotsVerticalIcon className="w-5 h-5 hover:bg-gray-300 rounded-lg"/>
                                        </button>
                                        {tooltipID === group.id && (
                                            // Logic and style for the delete button inside the drop-down menu
                                            <div className="absolute top-1/2 right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                <button
                                                    data-groupid={group.id}
                                                    onClick={() => onDeleteGroup(group.id)}
                                                    className='bg-white hover:bg-gray-300 px-2'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between mt-4">
                                {isAdmin(group) && (
                                    <button
                                        data-groupid={group.id}
                                        onClick={onEditGroup}
                                        className='mr-2 px-3'
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    data-groupid={group.id}
                                    onClick={onViewGroup}
                                    className='ml-2 px-3'
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No groups found.</p>
            )}
        </div>
    );
};

export default GroupList;
