require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const documentRoutes = require('./routes/documentRoutes');
const { initDB } = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/documents', documentRoutes);

// Database Initialization
initDB().then(db => {
    app.set('db', db);
    console.log('Database initialized');
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
