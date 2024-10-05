import bcrypt from 'bcrypt';
import pool from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        try {
            // Get the user from the database
            const userQuery = await pool.query(
                'SELECT * FROM Users WHERE username = $1',
                [username]
            );
            const user = userQuery.rows[0];

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Compare the stored hashed password with the provided password
            const match = await bcrypt.compare(password, user.userpass);
            if (!match) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Respond with user_id
            res.status(200).json({
                message: 'Sign-in successful',
                user_id: user.user_id, // Include user_id in the response
                username: user.username // Include username in the response
            });
        } catch (error) {
            console.error('Error signing in:', error);
            res.status(500).json({ error: 'Failed to sign in' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
