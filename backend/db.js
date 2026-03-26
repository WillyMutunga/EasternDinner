const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
        ? { rejectUnauthorized: false }
        : false,
    max: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    min: 2
});

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        );

        CREATE TABLE IF NOT EXISTS tickets (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS documents (
            id SERIAL PRIMARY KEY,
            name TEXT,
            filename TEXT,
            path TEXT,
            mimetype TEXT,
            size INTEGER,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
        CREATE INDEX IF NOT EXISTS idx_tickets_phone ON tickets(phone);
        CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
    `);

    // Insert default admins if not exists
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
            ['admin', hashedPassword, 'super_admin']
        );
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
            ['editor', hashedPassword, 'editor']
        );
    }

    console.log('PostgreSQL database initialized');
    return pool;
}

module.exports = { pool, initDB };
