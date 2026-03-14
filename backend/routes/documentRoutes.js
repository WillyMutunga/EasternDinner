const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, and Images are allowed!'));
        }
    }
});

// Admin: Upload a document
router.post('/upload', authMiddleware, roleMiddleware(['super_admin', 'editor']), upload.single('document'), async (req, res) => {
    const { name } = req.body;
    const db = req.app.get('db');
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        await db.query(
            'INSERT INTO documents (name, filename, path, mimetype, size) VALUES ($1, $2, $3, $4, $5)',
            [name || file.originalname, file.filename, file.path, file.mimetype, file.size]
        );
        res.status(201).json({ message: 'Document uploaded successfully', file });
    } catch (err) {
        console.error(err);
        fs.unlinkSync(file.path);
        res.status(500).json({ message: 'Failed to save document info to database' });
    }
});

// Public: Get all documents
router.get('/', async (req, res) => {
    const db = req.app.get('db');
    try {
        const result = await db.query('SELECT * FROM documents ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch documents' });
    }
});

// Admin: Delete a document
router.delete('/:id', authMiddleware, roleMiddleware(['super_admin', 'editor']), async (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');

    try {
        const check = await db.query('SELECT * FROM documents WHERE id = $1', [id]);
        const document = check.rows[0];
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        await db.query('DELETE FROM documents WHERE id = $1', [id]);

        if (fs.existsSync(document.path)) {
            fs.unlinkSync(document.path);
        }

        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete document' });
    }
});

module.exports = router;
