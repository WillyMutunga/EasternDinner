const jwt = require('jsonwebtoken');
const secret = 'super_secret_key_123';
const payload = { id: 1, role: 'super_admin' };

const token = jwt.sign(payload, secret);
console.log('--- JWT Isolation Test ---');
console.log('1. Generated Token:', token);

try {
    const decoded = jwt.verify(token, secret);
    console.log('2. Verification Result: SUCCESS');
    console.log('3. Decoded:', decoded);
} catch (err) {
    console.error('2. Verification Result: FAILED');
    console.error('3. Error:', err.message);
}

const headerValue = `Bearer ${token}`;
console.log('\n4. Header Value set in fetch:', headerValue);
const extracted = headerValue.slice(7).trim();
console.log('5. Extracted from header (using slice(7).trim()):', extracted);

try {
    jwt.verify(extracted, secret);
    console.log('6. Verification of extracted: SUCCESS');
} catch (err) {
    console.error('6. Verification of extracted: FAILED');
    console.error('7. Error:', err.message);
}
