// Component providing a form for items to be edited.

import React, { useState } from "react";
import styles from "../styles/AuthForm.module.css";

// Takes two properties:
//   - item: The item object being edited
//   - onSubmit: A callback function when the form is submitted, taking the new item object
export default function EditItemForm({ item, onSubmit }) {
  // State variable for title field
  const [title, setTitle] = useState(item ? item.title : "");
  const [dueDate, setDueDate] = useState(item.dueDate ? item.dueDate : null);
  const [priority, setPriority] = useState(item.priority);
  const [assignedUsers, setAssignedUsers] = useState(
    item.assignedUsers ? item.assignedUsers.map((user) => user.username) : []
  );
  const [addUserName, setAddUserName] = useState("");

  // Event handler for form being submitted
  const handleSubmit = () => {
    // Check title is not empty, if not submit new item
    if (title.length === 0) {
      alert("Title cannot be empty.");
      onSubmit(null);
    } else {
      console.log(
        assignedUsers.map((user) => {
          username: user;
        })
      );
      console.log(JSON.stringify(assignedUsers));
      onSubmit({
        ...item,
        dueDate: dueDate,
        title: title,
        priority: priority,
        assignedUsers: assignedUsers.map((user) => {
          return {
            username: user,
          };
        }),
      });
    }
  };

  const handleAddUser = (e) => {
    if (addUserName.length !== 0) {
      const newUsers = [...assignedUsers, addUserName];
      setAssignedUsers(newUsers);
      setAddUserName("");
    }
    e.preventDefault();
  };

  const handleDeleteUser = (e) => {
    const username = e.target.dataset.username;
    let newUsers = assignedUsers;
    console.log(newUsers);
    console.log(username);
    newUsers = newUsers.filter((user) => user !== username);
    console.log(newUsers);
    setAssignedUsers(newUsers);
  };

  return (
    <div className={styles.formBox}>
      <h2 className={styles.title}>Edit Item</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <label htmlFor="priority" className={styles.label}>
          Priority
        </label>
        <select className="rounded-md px-2.5 h-8"
          name="priority"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="0">Low Priority</option>
          <option value="1">Medium Priority</option>
          <option value="2">High Priority</option>
        </select>
        <label htmlFor="dueDate" className={styles.label}>
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={styles.input}
        />
        {/* List all users */}
        <label className={styles.label}>Assigned Users</label>
        <div>
          {/* should probably be scrollable inside */}
          {assignedUsers && assignedUsers.length > 0 ? (
            assignedUsers.map((user) => (
              <div class="grid gap-1 grid-cols-4 grid-rows-1 items-center">
                <p className="mt-1.5">{user}</p>
                <button
                  data-username={user}
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
          Update
        </button>
      </form>
    </div>
  );
}
