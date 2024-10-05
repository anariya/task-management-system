import { useState } from 'react';
import styles from '../styles/AuthForm.module.css';

export default function SignUpForm({ onSignUp, onSwitchToSignIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
                alert('Signed up successfully');
                onSwitchToSignIn();
            } else {
                alert(data.error || 'Sign-up failed');
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            alert('Sign-up failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Sign Up</h2>
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
                    <button type="submit" className={styles.button}>Sign Up</button>
                    <div className={styles.switchRow}>
                        <button type="button" onClick={onSwitchToSignIn} className={styles.switchButton}>Switch to Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
