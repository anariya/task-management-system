import React, { useEffect, useState } from "react";
import AddGroupForm from "./AddGroupForm";
import EditGroupForm from "./EditGroupForm";
import Layout from "./Layout";
import GroupList from './GroupList';

// takes properties:
// userID: ID of currently logged in user
// onGroupSelect: callback function which is passed group id that user selected to view
export default function GroupMenu({ userID, onGroupSelect }) {
  const [groups, setGroups] = useState([]);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showEditGroupForm, setShowEditGroupForm] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);

  const refreshGroups = async () => {
    const res = await fetch(`api/groups?userid=${userID}`);
    const data = await res.json();
    if (data && data.length > 0) {
      setGroups(data[0].groups);
    }
  };

  useEffect(() => {
    refreshGroups();
  }, []);

  const addGroup = async (group) => {
    await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group: group }),
    });
    refreshGroups();
  };

  const deleteGroup = async (group) => {
    await fetch("api/groups", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group: group }),
    });
    refreshGroups();
  };

  const editGroup = async (group) => {
    await fetch("api/groups", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ group: group })
    });
    refreshGroups();
  };

  const onViewGroup = (e) => {
    onGroupSelect(e.target.dataset.groupid);
  };

  const onEditGroup = (e) => {
    console.log(userID);
    setGroupToEdit(groups.find(group => Number(group.id) === Number(e.target.dataset.groupid)));
    setShowEditGroupForm(true);
  };

  const onDeleteGroup = (groupId) => {
    deleteGroup({
      id: groupId,
    });
  };

  const onAddGroup = () => {
    setShowAddGroupForm(true);
  };

  const onAddGroupSubmit = (name) => {
    const newGroup = {
      name: name,
      users: [
        {
          id: userID,
          role: "ADMIN",
        },
      ],
    };
    addGroup(newGroup);
    setShowAddGroupForm(false);
  };

  const onEditGroupSubmit = (id, name, users) => {
    const newGroup = {
      id: id,
      name: name,
      users: users.map(user => ({
        username: user[0],
        role: user[1]
      }))
    };

    editGroup(newGroup);
    setShowEditGroupForm(false);
  };

  const isAdmin = (group) => {
   
    return group.users.some(
      (user) => user.id === parseInt(userID) && user.role === "ADMIN"
    );
  };

  return (
    <div>
      {/* Add group form */}
      {showAddGroupForm && (
        <div className="absolute w-screen h-screen z-[10000] bg-transparent flex items-center justify-center">
          <AddGroupForm onSubmit={onAddGroupSubmit} />
        </div>
      )}

      {/* Edit group form */}
      {showEditGroupForm && (
        <div className="absolute w-screen h-screen z-[10000] bg-transparent flex items-center justify-center">
          <EditGroupForm currentUserID={userID} group={groupToEdit} onSubmit={onEditGroupSubmit} />
        </div>
      )}

      {/* Display all groups the user is in */}
      <div className="">
        <GroupList
          groups={groups}
          onViewGroup={onViewGroup}
          onEditGroup={onEditGroup}
          onDeleteGroup={onDeleteGroup}
          isAdmin={isAdmin}
        />
      </div>

      <button onClick={onAddGroup} className="mt-4">New Group</button>
    </div>
  );
}
