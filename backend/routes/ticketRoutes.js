const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public: Create Ticket
router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;
    const db = req.app.get('db');

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Please provide name, email, and phone' });
    }

    try {
        console.log('Attempting to create ticket with:', { name, email, phone });
        const result = await db.query(
            'INSERT INTO tickets (name, email, phone, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, phone, 'pending']
        );
        console.log('Ticket created successfully:', result.rows[0]);
        res.status(201).json({ id: result.rows[0].id, message: 'Ticket request saved. Please proceed with payment.' });
    } catch (err) {
        console.error('Error creating ticket:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ message: 'Failed to save ticket details', error: err.message });
    }
});

// Public: Verify Ticket status by email or phone
router.get('/verify', async (req, res) => {
    const { contact } = req.query;
    const db = req.app.get('db');

    if (!contact) {
        return res.status(400).json({ message: 'Please provide email or phone number' });
    }

    try {
        const result = await db.query(
            'SELECT id, name, email, phone, status, created_at FROM tickets WHERE email = $1 OR phone = $2 ORDER BY created_at DESC LIMIT 1',
            [contact, contact]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No ticket found for this contact info' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to verify ticket' });
    }
});

// Admin: Get all tickets
router.get('/admin', authMiddleware, roleMiddleware(['super_admin', 'editor']), async (req, res) => {
    const db = req.app.get('db');
    try {
        const result = await db.query('SELECT * FROM tickets ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch tickets' });
    }
});

// Admin: Approve Ticket
router.patch('/admin/:id/approve', authMiddleware, roleMiddleware(['super_admin', 'editor']), async (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');

    try {
        const check = await db.query('SELECT * FROM tickets WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await db.query('UPDATE tickets SET status = $1 WHERE id = $2', ['paid', id]);
        res.json({ message: 'Ticket approved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to approve ticket' });
    }
});

module.exports = router;
