const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let rawHeader = req.header('Authorization');
    console.log('--- Auth Middleware Debug ---');
    console.log('Raw Authorization Header:', JSON.stringify(rawHeader));

    let token = rawHeader;
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }
    console.log('Final Token for Verification:', JSON.stringify(token));

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const secret = 'super_secret_key_123';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};

module.exports = authMiddleware;
