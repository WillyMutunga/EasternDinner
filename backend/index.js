require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const documentRoutes = require('./routes/documentRoutes');
const { pool, initDB } = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        console.log('CORS check - Origin:', origin);
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        // Allow any *.onrender.com domain
        if (origin && origin.endsWith('.onrender.com')) {
            console.log('CORS: Render domain allowed:', origin);
            return callback(null, true);
        }
        // Allow explicitly listed origins
        if (allowedOrigins.includes(origin)) {
            console.log('CORS: Origin allowed');
            return callback(null, true);
        }
        console.log('CORS: Origin NOT allowed. Allowed origins:', allowedOrigins);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/documents', documentRoutes);

// Database Initialization
initDB().then(() => {
    app.set('db', pool);
    console.log('Database initialized');
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
