const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function initDB() {
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'database.sqlite');
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        );

        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            filename TEXT,
            path TEXT,
            mimetype TEXT,
            size INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Insert default admins if not exists
    const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'super_admin']);
        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['editor', hashedPassword, 'editor']);
    }

    return db;
}

module.exports = { initDB };
