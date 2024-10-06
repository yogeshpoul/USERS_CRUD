const express = require('express');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const cors = require('cors');

const app = express();
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

app.use(cors());
app.use(express.json());

// Create a new user
app.post('/users', [
    body('email').isEmail(),
    body('phone').isMobilePhone(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phone, email, address } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, phone, email, address]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update a user
app.put('/users/:id', [
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { firstName, lastName, phone, email, address } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, phone = $3, email = $4, address = $5 WHERE id = $6 RETURNING *',
            [firstName, lastName, phone, email, address, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
