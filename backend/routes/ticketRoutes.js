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
        const result = await db.run(
            'INSERT INTO tickets (name, email, phone, status) VALUES (?, ?, ?, ?)',
            [name, email, phone, 'pending']
        );
        res.status(201).json({ id: result.lastID, message: 'Ticket request saved. Please proceed with payment.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save ticket details' });
    }
});

// Public: Verify Ticket status by email or phone
router.get('/verify', async (req, res) => {
    const { contact } = req.query; // This can be email or phone
    const db = req.app.get('db');

    if (!contact) {
        return res.status(400).json({ message: 'Please provide email or phone number' });
    }

    try {
        const ticket = await db.get(
            'SELECT id, name, email, phone, status, created_at FROM tickets WHERE email = ? OR phone = ? ORDER BY created_at DESC LIMIT 1',
            [contact, contact]
        );

        if (!ticket) {
            return res.status(404).json({ message: 'No ticket found for this contact info' });
        }

        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to verify ticket' });
    }
});

// Admin: Get all tickets
router.get('/admin', authMiddleware, roleMiddleware(['super_admin', 'editor']), async (req, res) => {
    const db = req.app.get('db');
    try {
        const tickets = await db.all('SELECT * FROM tickets ORDER BY created_at DESC');
        res.json(tickets);
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
        const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await db.run('UPDATE tickets SET status = ? WHERE id = ?', ['paid', id]);
        res.json({ message: 'Ticket approved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to approve ticket' });
    }
});

module.exports = router;
