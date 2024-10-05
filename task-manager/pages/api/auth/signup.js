import bcrypt from 'bcrypt';
import pool from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        try {
            // Check if the user already exists in the database
            const existingUserQuery = await pool.query(
                'SELECT * FROM Users WHERE username = $1', 
                [username]
            );
            const existingUser = existingUserQuery.rows[0];

            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            await pool.query(
                'INSERT INTO Users (username, userpass) VALUES ($1, $2)',
                [username, hashedPassword]
            );

            res.status(200).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
