import { useState } from 'react';
import styles from '../styles/AuthForm.module.css';

export default function SignInForm({ onSignIn, onSwitchToSignUp }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user_id && data.username) {
                    // Pass user_id to the parent component or handle it as needed
                    onSignIn(data.user_id, data.username);
                } else {
                    alert('Unexpected response from server');
                }
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            alert('Sign-in failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Sign In</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className={styles.input}
                    />
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Sign In</button>
                    <div className={styles.switchRow}>
                        <button type="button" onClick={onSwitchToSignUp} className={styles.switchButton}>Create an Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
