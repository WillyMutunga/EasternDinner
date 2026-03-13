const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        'super_secret_key_123',
        { expiresIn: '1h' }
    );

    console.log('Generated token for', user.username, ':', token.substring(0, 10) + '...');
    res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
