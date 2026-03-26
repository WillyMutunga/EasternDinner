const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.header('Authorization');
    
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'super_secret_key_123';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};

module.exports = authMiddleware;
