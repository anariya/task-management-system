// Component providing a form for items to be edited.

import React, { useState } from 'react';
import styles from '../styles/AuthForm.module.css';

// Takes two properties:
//   - item: The item object being edited
//   - onSubmit: A callback function when the form is submitted, taking the new item object
export default function EditColumnForm({ column, onSubmit }) {
    // State variable for title field
    const [name, setName] = useState(column ? column.name : '');

    // Event handler for form being submitted
    const handleSubmit = (e) => {
        // Check nmae is not empty, if not submit new item
        if (name.length === 0) {
            alert('Title cannot be empty.');
            onSubmit(null);
        } else {
            onSubmit({
                ...column,
                name:name
            });
        }
        e.preventDefault()
    };

    return (
        <div className={styles.formBox}>
            <h2 className={styles.title}>Edit Column</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="name" className={styles.label}>Title</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Update</button>
            </form>
        </div>
    )
}