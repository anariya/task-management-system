// Component providing a form for a group to be edited

import React, { useState } from "react";
import styles from "../styles/AuthForm.module.css";

// takes two properties, one with the group that is being edited
// one with the current user ID (who cannot remove themselves)
// and one that is a callback function for when the form is submitted, giving the new name and users
export default function EditGroupForm({ group, currentUserID, onSubmit }) {
  const [name, setName] = useState(group.name);
  const [users, setUsers] = useState(
    group.users
      .filter((user) => user.id !== currentUserID)
      .map((user) => [user.username, user.role])
  );
  const [addUserName, setAddUserName] = useState("");

  const handleAddUser = (e) => {
    if (addUserName.length !== 0) {
      const newUsers = [...users, [addUserName, "MEMBER"]];
      setUsers(newUsers);
      setAddUserName("");
    }
    console.log(JSON.stringify(group.users));
    console.log(currentUserID);
    console.log(JSON.stringify(group.users
      .filter((user) => user.id !== currentUserID)
      .map((user) => [user.username, user.role])));
    e.preventDefault();
  };

  const handleRoleChange = (e) => {
    const username = e.target.dataset.username;
    const newUsers = users;
    newUsers[newUsers.findIndex((user) => user[0] === username)][1] =
      e.target.value === "member" ? "MEMBER" : "ADMIN";
    setUsers(newUsers);
  };

  const handleDeleteUser = (e) => {
    const username = e.target.dataset.username;
    let newUsers = users;
    newUsers = newUsers.filter((user) => user[0] !== username);
    setUsers(newUsers);
  };

  const handleSubmit = (e) => {
    if (name.length === 0) {
      alert("Name cannot be empty.");
    } else {
      const editingUser = group.users.find(user => user.id === currentUserID);
      onSubmit(group.id, name, [...users, [editingUser.username, editingUser.role]]);
    }
  };

  return (
    <div className={styles.formBox}>
      <h2 className={styles.title}>Edit Group</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="title" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        {/* List all users */}
        <label className={styles.label}>Users</label>
        <div>
          {/* should probably be scrollable inside */}
          {users && users.length > 0 ? (
            users.map((user) => (
              <div className="grid gap-1 grid-cols-4 grid-rows-1 items-center">
                <p className="mt-1.5">{user[0]}</p>
                <select data-username={user[0]} onChange={handleRoleChange} className="h-8 rounded-lg mt-1.5 px-2.5">
                  <option value="member" selected={user[1] === "MEMBER"}>
                    Member
                  </option>
                  <option value="admin" selected={user[1] === "ADMIN"}>
                    Admin
                  </option>
                </select>
                <button
                  data-username={user[0]}
                  className={`${styles.button} w-32`}
                  onClick={handleDeleteUser}
                >
                  Delete User
                </button>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <input
          id="adduser"
          type="text"
          value={addUserName}
          onChange={(e) => setAddUserName(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button} onClick={handleAddUser}>
          Add User
        </button>
        <button type="submit" className={styles.button}>
          Confirm
        </button>
      </form>
    </div>
  );
}
