const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Super Admin Only
router.get('/dashboard', authMiddleware, roleMiddleware(['super_admin']), (req, res) => {
    res.json({ message: 'Welcome to the Super Admin Dashboard', user: req.user });
});

// Editor and Super Admin
router.get('/content', authMiddleware, roleMiddleware(['editor', 'super_admin']), (req, res) => {
    res.json({ message: 'Content Management Access Granted', user: req.user });
});

// Any Admin
router.post('/audit-log', authMiddleware, roleMiddleware(['super_admin', 'editor', 'moderator']), (req, res) => {
    res.json({ message: 'Audit log entry created', action: req.body.action });
});

module.exports = router;
