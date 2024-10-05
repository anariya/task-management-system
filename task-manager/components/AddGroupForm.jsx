// Component providing a form for a new group to be added.

import React, { useState } from "react";
import styles from "../styles/AuthForm.module.css";

// takes one property, a callback function for when the form is submitted
export default function AddGroupForm({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.length === 0) {
      alert("Name cannot be empty.");
    } else {
      onSubmit(name);
    }
  };

  return (
    <div className={styles.formBox}>
      <h2 className={styles.title}>Add Group</h2>
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
        <button type="submit" className={styles.button}>
          Create Group
        </button>
      </form>
    </div>
  );
}
